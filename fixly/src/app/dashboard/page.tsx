"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NavBar } from "../../components/NavBar";
import { useAuth } from "../../components/AuthProvider";
import { getReports } from "../../app/actions/reports";
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, ChevronRight, Clock, MapPin } from "lucide-react";

type ReportData = {
    $id: string;
    description: string;
    severity: string;
    status: string;
    $createdAt: string;
    remediationPlan?: string;
    projectName?: string;
    inspectionLocation?: string;
};

export default function Dashboard() {
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [reports, setReports] = useState<ReportData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user) return;
        async function fetchHistory() {
            try {
                const res = await getReports(user!.$id);
                if (res.success && res.documents) {
                    setReports(res.documents as unknown as ReportData[]);
                } else {
                    setError("Failed to fetch historical reports.");
                }
            } catch (err: any) {
                setError(err.message || "An error occurred fetching history.");
            } finally {
                setIsLoading(false);
            }
        }
        fetchHistory();
    }, [user]);

    function getSeverityBadge(severity: string) {
        let colors = 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10';
        switch (severity?.toLowerCase()) {
            case 'critical': colors = 'bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30'; break;
            case 'high': colors = 'bg-orange-500/10 text-orange-600 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30'; break;
            case 'medium': colors = 'bg-yellow-500/10 text-yellow-600 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30'; break;
            case 'low': colors = 'bg-green-500/10 text-green-600 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30'; break;
        }
        return <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${colors}`}>{severity}</span>;
    }

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center">
                <NavBar />
                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center isolate">
            <NavBar />

            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
            </div>

            <main className="w-full max-w-4xl px-6 pt-32 pb-20 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex flex-col items-center"
                >
                    <div className="w-full flex flex-col items-center text-center space-y-6 mb-16">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm"
                        >
                            <Activity className="w-8 h-8" />
                        </motion.div>

                        <div className="space-y-3">
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
                                Your Inspections
                            </h1>
                            <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                                All safety audits for <span className="font-semibold text-foreground">{user.name}</span>.
                            </p>
                        </div>

                        <div className="px-6 py-2 rounded-full border bg-card/30 backdrop-blur-sm border-border/50 shadow-sm flex items-center gap-3">
                            <span className="text-2xl font-black text-primary tabular-nums">
                                {isLoading ? "---" : reports.length}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground pt-1">
                                Total Audits
                            </span>
                        </div>
                    </div>

                    <div className="w-full space-y-4 flex flex-col items-center">
                        {isLoading ? (
                            <div className="py-20 flex flex-col items-center gap-6">
                                <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <p className="text-muted-foreground text-sm font-medium animate-pulse">Loading reports...</p>
                            </div>
                        ) : error ? (
                            <div className="w-full max-w-md bg-destructive/5 border border-destructive/20 p-8 rounded-3xl flex flex-col items-center text-center gap-4 backdrop-blur-md">
                                <AlertTriangle className="w-8 h-8 text-destructive" />
                                <div>
                                    <p className="font-bold text-destructive">Dashboard Error</p>
                                    <p className="text-sm text-destructive/80 mt-1">{error}</p>
                                </div>
                            </div>
                        ) : reports.length === 0 ? (
                            <div className="w-full max-w-md py-20 px-10 bg-card/20 backdrop-blur-md border border-dashed rounded-3xl flex flex-col items-center text-center gap-6">
                                <ShieldAlert className="w-12 h-12 text-muted-foreground/30" />
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">No reports yet</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed">Submit your first inspection to see results here.</p>
                                </div>
                                <button
                                    onClick={() => router.push('/app')}
                                    className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg shadow-primary/25 hover:scale-105 transition-transform"
                                >
                                    Launch Inspector
                                </button>
                            </div>
                        ) : (
                            reports.map((report, idx) => (
                                <motion.div
                                    key={report.$id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05, ease: "easeOut" }}
                                    className="group w-full max-w-3xl p-6 md:p-8 rounded-[2rem] border bg-card/40 backdrop-blur-md border-border/50 hover:bg-card/60 hover:border-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-xl hover:shadow-primary/5"
                                    onClick={() => router.push(`/report/${report.$id}`)}
                                >
                                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                        <div className="flex-1 space-y-5 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3">
                                                {getSeverityBadge(report.severity)}
                                                <div className="flex items-center text-[10px] font-bold text-muted-foreground bg-muted/50 px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                                                    <Clock className="w-3.5 h-3.5 mr-2 opacity-60" />
                                                    {new Date(report.$createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center text-[10px] font-black text-white bg-primary px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                                                    <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                                    {report.status}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                                                    {report.projectName || "Project Audit"}
                                                </h3>
                                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground text-sm font-medium">
                                                    <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary/60" />{report.inspectionLocation || "Primary Site"}</span>
                                                    <span className="opacity-20 hidden md:block">•</span>
                                                    <span className="italic truncate line-clamp-1 opacity-80">{report.description || "Historical data record."}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center self-end md:self-center">
                                            <div className="p-3 rounded-full bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}

                        <div className="h-10 w-full" />
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
