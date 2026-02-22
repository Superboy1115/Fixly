import { Client, Databases } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '')
    .setSelfSigned(true);

const databases = new Databases(client);

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'Frontline_DB';
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID || 'Hazards';

async function diagnose() {
    console.log('--- DIAGNOSTICS ---');
    console.log('Endpoint:', process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
    console.log('Project ID:', process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
    console.log('Database ID:', DATABASE_ID);
    console.log('Collection ID:', COLLECTION_ID);

    try {
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
        console.log('\nCollection found:', collection.name);
        console.log('Attributes:');
        collection.attributes.forEach((attr: any) => {
            console.log(` - ${attr.key} (${attr.type}, status: ${attr.status}, size: ${attr.size || 'N/A'})`);
        });
    } catch (e: any) {
        console.error('\nError getting collection:', e.message);
    }
}

diagnose();
