'use server';

import { Client, Databases, Query, Storage } from 'node-appwrite';

// Bypass strict Node native fetch TLS checks for self-signed hackathon IPs
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '')
    .setSelfSigned(true);

const databases = new Databases(client);
const storage = new Storage(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'Frontline_DB';
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || 'Hazards';
const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'Site_Images';

export async function getReports(userId?: string) {
    try {
        const queries = [Query.orderDesc('$createdAt')];
        if (userId) {
            queries.push(Query.equal('userId', userId));
        }
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            queries
        );
        return { success: true, documents: JSON.parse(JSON.stringify(response.documents)) };
    } catch (error: any) {
        console.error('Error fetching reports:', error);
        return { success: false, error: error.message };
    }
}

export async function getReportById(id: string) {
    try {
        const document = await databases.getDocument(DATABASE_ID, COLLECTION_ID, id);
        return { success: true, document: JSON.parse(JSON.stringify(document)) };
    } catch (error: any) {
        console.error('Error fetching report:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteReport(docId: string, imageId?: string) {
    try {
        if (imageId) {
            try {
                await storage.deleteFile(BUCKET_ID, imageId);
            } catch (e) {
                console.error('Could not delete image:', e);
            }
        }
        await databases.deleteDocument(DATABASE_ID, COLLECTION_ID, docId);
        return { success: true };
    } catch (error: any) {
        console.error('Error deleting report:', error);
        return { success: false, error: error.message };
    }
}
