'use server';

import { Client, Account, ID } from 'node-appwrite';
import { cookies } from 'next/headers';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

function createAdminClient() {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
        .setKey(process.env.APPWRITE_API_KEY || '')
        .setSelfSigned(true);
    return { account: new Account(client) };
}

function createSessionClient(session: string) {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
        .setSelfSigned(true)
        .setSession(session);
    return { account: new Account(client) };
}

export async function signup(email: string, password: string, name: string) {
    try {
        const { account } = createAdminClient();
        // Create the user
        await account.create(ID.unique(), email, password, name);
        // Create a session
        const session = await account.createEmailPasswordSession(email, password);

        // Set session cookie
        const cookieStore = await cookies();
        cookieStore.set('session', session.secret, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return { success: true };
    } catch (error: any) {
        console.error('Signup error:', error);
        return { success: false, error: error.message || 'Failed to create account' };
    }
}

export async function login(email: string, password: string) {
    try {
        const { account } = createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);

        const cookieStore = await cookies();
        cookieStore.set('session', session.secret, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 30,
        });

        return { success: true };
    } catch (error: any) {
        console.error('Login error:', error);
        return { success: false, error: error.message || 'Invalid credentials' };
    }
}

export async function logout() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session');
        if (session) {
            const { account } = createSessionClient(session.value);
            await account.deleteSession('current');
        }
        cookieStore.delete('session');
        return { success: true };
    } catch (error: any) {
        console.error('Logout error:', error);
        // Still clear the cookie even if the API call fails
        const cookieStore = await cookies();
        cookieStore.delete('session');
        return { success: true };
    }
}

export async function getUser() {
    try {
        const cookieStore = await cookies();
        const session = cookieStore.get('session');
        if (!session) return null;

        const { account } = createSessionClient(session.value);
        const user = await account.get();
        return { $id: user.$id, name: user.name, email: user.email };
    } catch (error) {
        return null;
    }
}
