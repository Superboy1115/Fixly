import { Client, Account, Databases, Storage } from 'appwrite';

export const appwriteConfig = {
    endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'Frontline_DB',
    collectionId: process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || 'Hazards',
    bucketId: process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'Site_Images',
    devKey: process.env.NEXT_PUBLIC_APPWRITE_DEV_KEY || '',
};

const client = new Client()
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId);

if (appwriteConfig.devKey) {
    (client as any).setDevKey(appwriteConfig.devKey);
}

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// Helper function to login anonymously if not already logged in
export async function loginAnonymously() {
    try {
        return await account.get();
    } catch (e) {
        return await account.createAnonymousSession();
    }
}

export function getImageUrl(imageId: string) {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
    const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || 'Site_Images';
    return `${endpoint}/storage/buckets/${bucketId}/files/${imageId}/view?project=${projectId}&mode=admin`;
}
