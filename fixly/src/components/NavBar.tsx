"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { motion } from "framer-motion";
import { HardHat, LogOut, User, LayoutDashboard, Camera } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { logout } from "../app/actions/auth";

export function NavBar() {
    const { user, loading, refresh } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await logout();
        await refresh();
        router.push("/");
    };

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Fix", href: "/app", icon: Camera },
        { name: "About", href: "/about" },
    ];

    return (
        <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed top-0 left-0 right-0 z-50 mt-6 mx-auto max-w-5xl px-6 py-3 rounded-full flex items-center justify-between border shadow-sm backdrop-blur-xl
        bg-white/40 border-white/60
        dark:bg-zinc-900/40 dark:border-white/10 dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]"
        >
            <Link href="/" className="flex items-center gap-2 group">
                <HardHat className="w-7 h-7 text-primary" />
                <span className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-500 dark:to-yellow-400">
                    Fixly
                </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={`relative transition-colors hover:text-primary ${pathname === link.href ? "text-primary font-bold" : "text-foreground/70"
                            } after:absolute after:bottom-[-4px] after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100 ${pathname === link.href ? "after:scale-x-100" : ""
                            }`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-3">
                <ThemeToggle />
                {loading ? (
                    <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
                ) : user ? (
                    <div className="flex items-center gap-2">
                        <Link
                            href="/profile"
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all hover:bg-muted/50 ${pathname === "/profile" ? "bg-primary/10 border-primary/30 text-primary" : "bg-muted/30 border-border/50 text-foreground"
                                }`}
                        >
                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-[10px] font-black">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="hidden sm:inline text-xs font-bold truncate max-w-[80px]">{user.name.split(' ')[0]}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted/30 border border-border/50 text-foreground/70 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-all active:scale-95"
                            title="Sign out"
                        >
                            <LogOut className="w-4 h-4 ml-0.5" />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="inline-flex h-10 items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Sign In
                    </Link>
                )}
            </div>
        </motion.header>
    );
}
