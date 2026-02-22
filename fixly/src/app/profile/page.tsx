"use client";

import { motion } from "framer-motion";
import { NavBar } from "../../components/NavBar";
import { useAuth } from "../../components/AuthProvider";
import { User, Mail, Shield, HardHat, Calendar, LogOut, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { logout } from "../actions/auth";
import Link from "next/link";

export default function ProfilePage() {
    const { user, loading, refresh } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        await refresh();
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <NavBar />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md p-10 rounded-[2.5rem] border bg-card/40 backdrop-blur-md border-border/50 shadow-2xl flex flex-col items-center gap-6"
                >
                    <div className="w-20 h-20 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-inner">
                        <Shield className="w-10 h-10" />
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tight underline decoration-destructive/30 decoration-4 underline-offset-4">Access Denied</h1>
                        <p className="text-muted-foreground font-medium leading-relaxed">
                            You must be authenticated to view your profile settings and secure inspection logs.
                        </p>
                    </div>
                    <Link
                        href="/login"
                        className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-lg shadow-lg shadow-primary/25 hover:scale-[1.02] transition-transform active:scale-[0.98] flex items-center justify-center"
                    >
                        Sign In to Fixly
                    </Link>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background selection:bg-primary selection:text-white isolate">
            <NavBar />

            {/* Ambient background */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px] dark:bg-primary/20 transition-colors duration-500 animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-secondary/20 blur-[150px] dark:bg-purple-600/10 transition-colors duration-500" />
            </div>

            <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-8"
                >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20">
                                My Workspace
                            </span>
                            <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
                                Profile<span className="text-primary truncate">.</span>
                            </h1>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="inline-flex h-12 items-center gap-2 px-6 rounded-2xl bg-muted/50 border border-border/50 hover:bg-muted font-bold text-sm transition-all active:scale-[0.98]"
                        >
                            <ArrowLeft className="w-4 h-4" /> Go Back
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        {/* Avatar / Sidebar */}
                        <div className="flex flex-col gap-6">
                            <div className="p-8 rounded-[2.5rem] border bg-card/60 backdrop-blur-md border-border/50 shadow-xl flex flex-col items-center text-center">
                                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center text-white text-3xl font-black shadow-lg mb-6 ring-4 ring-primary/10">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight mb-1">{user.name}</h2>
                                <p className="text-sm text-muted-foreground font-medium mb-6">{user.email}</p>
                                <div className="w-full pt-6 border-t border-border/50 flex flex-col gap-3">
                                    <div className="flex items-center justify-between px-2">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Global Status</span>
                                        <span className="flex items-center gap-1.5 text-xs font-bold text-green-500">
                                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Active
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleLogout}
                                className="w-full h-14 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive font-bold text-sm flex items-center justify-center gap-3 hover:bg-destructive hover:text-white transition-all shadow-sm active:scale-[0.98]"
                            >
                                <LogOut className="w-4 h-4" /> Sign Out
                            </button>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-2 space-y-8">
                            <div className="p-8 md:p-10 rounded-[2.5rem] border bg-card/40 backdrop-blur-md border-border/50 shadow-sm space-y-10">
                                <section className="space-y-6">
                                    <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-3">
                                        <User className="w-5 h-5 text-primary" /> User Credentials
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-1.5">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Full Name</p>
                                            <p className="font-bold text-foreground">{user.name}</p>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 space-y-1.5">
                                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Email Address</p>
                                            <p className="font-bold text-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-6">
                                    <h3 className="text-lg font-bold tracking-tight text-foreground flex items-center gap-3">
                                        <HardHat className="w-5 h-5 text-primary" /> Professional Profile
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-between">
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">User ID</p>
                                                <p className="font-mono text-xs font-bold text-foreground/70">{user.$id}</p>
                                            </div>
                                            <Shield className="w-6 h-6 text-primary/30" />
                                        </div>
                                        <div className="p-5 rounded-2xl bg-muted/20 border border-border/40 flex items-center justify-between">
                                            <div className="space-y-1.5">
                                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Last Activity</p>
                                                <p className="font-bold text-foreground flex items-center gap-2">
                                                    <Calendar className="w-4 h-4 text-primary/60" /> {new Date().toLocaleDateString()}
                                                </p>
                                            </div>
                                            <span className="text-[10px] font-bold text-primary px-2 py-0.5 rounded bg-primary/10">STABLE</span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-amber-500/5 border border-primary/10 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="space-y-2">
                                    <h4 className="text-xl font-bold tracking-tight">Need a full site audit?</h4>
                                    <p className="text-sm text-muted-foreground font-medium">Head back to the workspace to analyze more hazards.</p>
                                </div>
                                <Link
                                    href="/app"
                                    className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all flex items-center text-center"
                                >
                                    Start Analysis
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
