"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NavBar } from "../../components/NavBar";
import { login, signup } from "../actions/auth";
import { useAuth } from "../../components/AuthProvider";
import { HardHat, Mail, Lock, User, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const { refresh } = useAuth();
    const [mode, setMode] = useState<"login" | "signup">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = mode === "login"
                ? await login(email, password)
                : await signup(email, password, name);

            if (result.success) {
                await refresh();
                router.push("/app");
            } else {
                setError(result.error || "Something went wrong. Please try again.");
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <NavBar />
            <main className="flex flex-col min-h-screen items-center justify-center px-4 pt-28 pb-20">
                {/* Ambient Background */}
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-md flex flex-col items-center"
                >
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm mb-6"
                        >
                            <HardHat className="w-8 h-8" />
                        </motion.div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                            {mode === "login" ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg">
                            {mode === "login"
                                ? "Sign in to access your inspections."
                                : "Get started with Fixly in seconds."}
                        </p>
                    </div>

                    {/* Form Card */}
                    <form
                        onSubmit={handleSubmit}
                        className="w-full p-8 rounded-3xl border bg-card/40 backdrop-blur-md border-border/50 shadow-xl space-y-5"
                    >
                        {mode === "signup" && (
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    className="w-full h-11 px-4 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" /> Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@company.com"
                                required
                                className="w-full h-11 px-4 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                <Lock className="w-4 h-4 text-primary" /> Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                minLength={8}
                                className="w-full h-11 px-4 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 font-medium flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {mode === "login" ? "Signing in..." : "Creating account..."}
                                </>
                            ) : (
                                <>
                                    {mode === "login" ? "Sign In" : "Create Account"}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>

                        <div className="border-t border-border/50 pt-5">
                            <p className="text-center text-sm text-muted-foreground">
                                {mode === "login" ? "Don't have an account?" : "Already have an account?"}
                                <button
                                    type="button"
                                    onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); }}
                                    className="ml-2 text-primary font-semibold hover:underline"
                                >
                                    {mode === "login" ? "Sign Up" : "Sign In"}
                                </button>
                            </p>
                        </div>
                    </form>
                </motion.div>
            </main>
        </>
    );
}
