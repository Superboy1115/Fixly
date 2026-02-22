import { Client, Databases, Storage, ID, Permission, Role, IndexType } from 'node-appwrite';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Setup Appwrite client
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

const RESET = process.argv.includes('--reset');

async function setupAppwrite() {
    // If --reset flag, delete collection and bucket first
    if (RESET) {
        console.log('⚠️  RESET MODE — Deleting existing data...');
        try {
            await databases.deleteCollection(DATABASE_ID, COLLECTION_ID);
            console.log('   Collection deleted.');
        } catch (e) { console.log('   No collection to delete.'); }
        try {
            await storage.deleteBucket(BUCKET_ID);
            console.log('   Bucket deleted.');
        } catch (e) { console.log('   No bucket to delete.'); }
    }

    try {
        console.log('1. Creating Database...');
        await databases.create(DATABASE_ID, 'Frontline DB');
        console.log('Database created successfully.');
    } catch (e: any) {
        if (e.code === 409) console.log('Database already exists.');
        else console.error('Error creating database:', e);
    }

    try {
        console.log('2. Creating Collection...');
        await databases.createCollection(
            DATABASE_ID,
            COLLECTION_ID,
            'Hazards',
            [Permission.read(Role.any()), Permission.create(Role.any()), Permission.update(Role.any()), Permission.delete(Role.any())]
        );
        console.log('Collection created successfully.');
    } catch (e: any) {
        if (e.code === 409) console.log('Collection already exists.');
        else console.error('Error creating collection:', e);
    }

    console.log('Adding Attributes to Collection...');
    const createAttr = async (name: string, promise: Promise<any>) => {
        try {
            process.stdout.write(`   Creating attribute "${name}"... `);
            await promise;
            console.log('✅');
        } catch (e: any) {
            if (e.code === 409) console.log('Already exists.');
            else {
                console.log('❌');
                console.error(`   Error creating attribute "${name}":`, e.message);
            }
        }
    };

    await createAttr('description', databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'description', 2000, false));
    await createAttr('severity', databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'severity', 50, false));
    await createAttr('status', databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'status', 50, false));
    await createAttr('coordinates', databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'coordinates', 5000, false));
    await createAttr('imageId', databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'imageId', 255, false));
    await createAttr('remediationPlan', databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'remediationPlan', 5000, false)); // Reduced size just in case
    await createAttr('projectName', databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'projectName', 255, false));
    await createAttr('inspectionLocation', databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'inspectionLocation', 255, false));
    await createAttr('userId', databases.createStringAttribute(DATABASE_ID, COLLECTION_ID, 'userId', 255, false));

    console.log('Attributes updated.');

    // Verify attributes
    try {
        const collection = await databases.getCollection(DATABASE_ID, COLLECTION_ID);
        const attributeKeys = collection.attributes.map((a: any) => a.key);
        console.log('Current attributes in collection:', attributeKeys);
        if (!attributeKeys.includes('remediationPlan')) {
            console.error('❌ CRITICAL: remediationPlan is STILL MISSING after attempted creation!');
        }
    } catch (e: any) {
        console.error('Error verifying attributes:', e.message);
    }

    // Wait for attributes to be ready before creating indexes
    console.log('Waiting for attributes to index...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Create index on userId for fast queries
    try {
        await databases.createIndex(DATABASE_ID, COLLECTION_ID, 'userId_idx', IndexType.Key, ['userId']);
        console.log('Index on userId created.');
    } catch (e: any) {
        if (e.code === 409) console.log('Index already exists.');
        else console.error('Error creating index:', e);
    }

    try {
        console.log('3. Creating Storage Bucket...');
        await storage.createBucket(
            BUCKET_ID,
            'Site Images',
            [Permission.read(Role.any()), Permission.create(Role.any()), Permission.update(Role.any()), Permission.delete(Role.any())],
            false,
            true,
            undefined,
            ['jpg', 'png', 'jpeg', 'webp']
        );
        console.log('Bucket created successfully.');
    } catch (e: any) {
        if (e.code === 409) console.log('Bucket already exists.');
        else console.error('Error creating bucket:', e);
    }

    console.log('✅ Setup finished.');
}

setupAppwrite();
