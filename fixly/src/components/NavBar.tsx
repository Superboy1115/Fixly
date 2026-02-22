"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";
import { HardHat, LogOut, User } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { logout } from "../app/actions/auth";

export function NavBar() {
    const { user, loading, refresh } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        await refresh();
        router.push("/");
    };

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 mt-6 mx-auto max-w-5xl px-6 py-3 rounded-full flex items-center justify-between border shadow-sm backdrop-blur-xl
        bg-white/40 border-white/60
        dark:bg-zinc-900/40 dark:border-white/10 dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
        >
            <Link href="/" className="flex items-center gap-2 group">
                <HardHat className="w-7 h-7 text-primary" />
                <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-500 dark:to-yellow-400">
                    Fixly
                </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                <Link href="/" className="relative text-foreground/80 hover:text-primary transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                    Home
                </Link>
                <Link href="/dashboard" className="relative text-foreground/80 hover:text-primary transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                    Dashboard
                </Link>
                <Link href="/app" className="relative text-foreground/80 hover:text-primary transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                    Fix
                </Link>
                <Link href="/about" className="relative text-foreground/80 hover:text-primary transition-colors after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100">
                    About Us
                </Link>
            </nav>

            <div className="flex items-center gap-3">
                <ThemeToggle />
                {loading ? (
                    <div className="w-20 h-9 rounded-full bg-muted animate-pulse" />
                ) : user ? (
                    <div className="flex items-center gap-2">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                            <User className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-semibold text-foreground truncate max-w-[100px]">{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex h-9 items-center justify-center rounded-full bg-muted/50 border border-border/50 px-3 py-2 text-sm font-medium text-foreground/70 shadow-sm transition-colors hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 active:scale-95"
                            title="Sign out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="inline-flex h-9 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 active:scale-95"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </motion.header>
    );
}
