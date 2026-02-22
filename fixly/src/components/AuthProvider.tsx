"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getUser } from "../app/actions/auth";

type User = {
    $id: string;
    name: string;
    email: string;
} | null;

type AuthContextType = {
    user: User;
    loading: boolean;
    refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refresh: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    const refresh = async () => {
        setLoading(true);
        try {
            const u = await getUser();
            setUser(u);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, refresh }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
