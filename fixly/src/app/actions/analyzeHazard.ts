'use server';

import { GoogleGenAI } from '@google/genai';
import { Client, Storage, Databases, ID } from 'node-appwrite';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

// Bypass strict Node native fetch TLS checks for self-signed hackathon IPs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '')
    .setSelfSigned(true);

const storage = new Storage(client);
const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'Frontline_DB';
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || 'Hazards';
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'Site_Images';

export async function submitHazardReport(formData: FormData) {
    try {
        const file = formData.get('image') as File;
        const projectName = (formData.get('projectName') as string) || "Downtown Tower Expansion";
        const inspectionLocation = (formData.get('inspectionLocation') as string) || "Sector B - Scaffolding";
        const userId = (formData.get('userId') as string) || "";

        if (!file) throw new Error('No image provided');

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 1. Analyze with Gemini 3.0 Flash using the new SDK
        const prompt = `
            You are "Fixly Technical Lead," a world-class forensic engineer.
            Analyze this image for MULTIPLE construction hazards.

            STEP 1 — VALIDATION:
            If not construction-related, return {"severity": "Invalid", "description": "..."}.

            STEP 2 — MULTI-HAZARD ANALYSIS:
            Identify ALL visible hazards. Return a "hazards" array.
            Each hazard MUST have:
            - "label": Short name (e.g. "Trip Hazard")
            - "coordinates": [ymin, xmin, ymax, xmax] (normalized 0.0-1.0)
            - "severity": "Low" | "Medium" | "High" | "Critical"
            - "reason": 1-sentence danger.

            STEP 3 — REMEDIATION:
            Plan for the collective set of hazards.

            Respond in raw JSON:
            {
                "hazards": [{ "label": "...", "coordinates": [0,0,0,0], "severity": "...", "reason": "..." }],
                "description": "...",
                "severity": "...",
                "remediationPlan": {
                    "fixSteps": [...],
                    "materialsList": [...],
                    "tooling": [...],
                    "complexity": { "skillLevel": "...", "laborHoursRange": "..." },
                    "safetyWarning": "..."
                }
            }
        `;

        const imagePart = {
            inlineData: {
                data: buffer.toString('base64'),
                mimeType: file.type,
            },
        };

        const result = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [prompt, imagePart]
        });

        const responseText = result.text?.trim() || '{}';

        // Remove markdown formatting if the model still included it
        const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const analysis = JSON.parse(cleanJson);

        if (analysis.severity?.toLowerCase() === 'invalid') {
            return {
                success: false,
                invalidImage: true,
                description: analysis.description || "The image does not appear to be construction related."
            };
        }

        // 2. Upload to Appwrite Storage
        const appwriteFile = await storage.createFile(
            BUCKET_ID,
            ID.unique(),
            file as any
        );
        const imageId = appwriteFile.$id;

        // 3. Save to Appwrite Database
        const doc = await databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            ID.unique(),
            {
                description: analysis.description,
                severity: analysis.severity,
                status: 'Reported',
                coordinates: JSON.stringify(analysis.hazards || []),
                imageId: imageId,
                remediationPlan: analysis.remediationPlan ? JSON.stringify(analysis.remediationPlan) : "",
                projectName: projectName,
                inspectionLocation: inspectionLocation,
                userId: userId
            }
        );

        return { success: true, docId: doc.$id };
    } catch (error: any) {
        console.error('Error in submitHazardReport:', error);
        return { success: false, error: error.message };
    }
}
