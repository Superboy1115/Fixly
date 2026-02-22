"use client";

import { useAuth } from "./AuthProvider";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">Authenticating...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center isolate">
                {/* Ambient background */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] h-[400px] w-[400px] rounded-full bg-destructive/5 blur-[100px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full p-10 md:p-12 rounded-[2.5rem] border bg-card/40 backdrop-blur-md border-border/50 shadow-2xl flex flex-col items-center gap-8"
                >
                    <div className="relative">
                        <div className="w-24 h-24 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-inner">
                            <Shield className="w-12 h-12" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-background border flex items-center justify-center shadow-lg">
                            <Lock className="w-5 h-5 text-primary" />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-3xl font-black tracking-tighter text-foreground">Secure Access Only</h1>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            This workspace is restricted to authorized site inspectors. Please sign in to access your dashboard and inspection tools.
                        </p>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <Link
                            href="/login"
                            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center active:scale-[0.98]"
                        >
                            Sign In to Fixly
                        </Link>
                        <Link
                            href="/"
                            className="w-full h-14 rounded-2xl border bg-background/50 text-foreground font-bold text-sm flex items-center justify-center hover:bg-muted transition-all"
                        >
                            Return to Homepage
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return <>{children}</>;
}
