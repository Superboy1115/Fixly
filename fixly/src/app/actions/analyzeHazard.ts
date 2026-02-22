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
            You are "Fixly Technical Lead," the world's top forensic structural engineer and master contractor with 30+ years across ALL construction trades (Electrical, Plumbing, HVAC, Structural, Framing, Finishing, Roofing, Concrete, Heavy Equipment).

            STEP 1 — IMAGE VALIDATION:
            Determine if this image is related to construction, buildings, infrastructure, utility equipment, job sites, or any built environment.
            - If it is NOT construction-related (selfie, pet, food, screenshot, random object), return ONLY:
              {"severity": "Invalid", "description": "This image does not appear to be related to construction or site inspection.", "coordinates": [], "remediationPlan": null}

            STEP 2 — HAZARD ANALYSIS (for valid construction images):
            You MUST identify the primary hazard, defect, wear issue, code violation, or safety concern visible in the image.
            Even if the scene looks "fine," identify the MOST significant area of concern — aging materials, potential failure points, wear patterns, moisture damage, improper installations, etc.
            There is ALWAYS something to flag on a construction site. Be thorough.

            *** CRITICAL — BOUNDING BOX RULES ***
            - You MUST ALWAYS return a bounding box in "coordinates" for every valid construction image. NO EXCEPTIONS.
            - The coordinates array MUST contain exactly 4 normalized float values: [ymin, xmin, ymax, xmax]
            - All values MUST be between 0.0 and 1.0, representing percentages of image dimensions.
            - The box MUST tightly surround the identified hazard area.
            - NEVER return an empty coordinates array [] for a valid construction image.
            - Example: A hazard in the center-right of the image → [0.25, 0.45, 0.75, 0.90]
            - Example: A hazard covering most of the image → [0.05, 0.05, 0.95, 0.95]
            - Example: A small crack in the upper-left → [0.10, 0.08, 0.35, 0.40]

            STEP 3 — REMEDIATION PLAN:
            Generate a comprehensive, actionable remediation plan. Be specific with quantities, specs, and trade-level detail.

            Respond in raw JSON only (no markdown, no backticks, no explanation text):
            {
                "description": "2-3 sentence expert assessment of the identified hazard, its root cause, and potential consequences if unaddressed.",
                "severity": "Low" | "Medium" | "High" | "Critical",
                "coordinates": [ymin, xmin, ymax, xmax],
                "remediationPlan": {
                    "fixSteps": ["Detailed step 1...", "Detailed step 2...", "...at least 3-5 steps"],
                    "materialsList": ["Qty x Material (exact specs/dimensions)", "..."],
                    "tooling": ["Specific tool 1", "Specific tool 2", "..."],
                    "complexity": {
                        "skillLevel": "Apprentice" | "Journeyman" | "Master",
                        "laborHoursRange": "X-Y"
                    },
                    "safetyWarning": "Specific PPE and safety precautions required for this repair."
                }
            }

            laborHoursRange examples: "0.5-1", "2-4", "8-12". Always a string range.
            fixSteps: Minimum 3 steps, maximum 8. Be specific and actionable.
            materialsList: Include quantities and specifications.
            safetyWarning: Always include relevant PPE and lockout/tagout if applicable.
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
                coordinates: JSON.stringify(analysis.coordinates),
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
