"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NavBar } from "../../components/NavBar";
import { useAuth } from "../../components/AuthProvider";
import { AuthGuard } from "../../components/AuthGuard";
import { getReports } from "../../app/actions/reports";
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, ChevronRight, Clock, MapPin, Search } from "lucide-react";

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
    const { user } = useAuth();
    const [reports, setReports] = useState<ReportData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        return <span className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-wider ${colors}`}>{severity}</span>;
    }

    return (
        <AuthGuard>
            <div className="min-h-screen bg-background flex flex-col items-center isolate">
                <NavBar />

                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                </div>

                <main className="w-full max-w-5xl px-6 pt-32 pb-20 flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="w-full"
                    >
                        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-8 mb-16">
                            <div className="space-y-4 text-center md:text-left">
                                <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 inline-block">
                                    Security Dashboard
                                </span>
                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-[0.9]">
                                    My Logs<span className="text-primary truncate">.</span>
                                </h1>
                                <p className="text-muted-foreground text-lg max-w-md leading-relaxed font-medium">
                                    Historical safety audits for <span className="text-foreground underline decoration-primary/30 decoration-2 underline-offset-4">{user?.name}</span>.
                                </p>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-3">
                                <div className="px-6 py-2.5 rounded-[1.5rem] border bg-card/30 backdrop-blur-sm border-border/50 shadow-sm flex items-center gap-4 group hover:border-primary/30 transition-all">
                                    <span className="text-3xl font-black text-primary tabular-nums group-hover:scale-110 transition-transform">
                                        {isLoading ? "---" : reports.length}
                                    </span>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground leading-none">Total</span>
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground leading-none mt-1">Inspections</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {isLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center gap-6 bg-card/10 rounded-[3rem] border border-dashed border-border/40">
                                    <div className="relative">
                                        <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                        <div className="absolute inset-0 w-12 h-12 rounded-full border border-primary/10" />
                                    </div>
                                    <p className="text-muted-foreground text-sm font-black uppercase tracking-widest animate-pulse">Syncing Encrypted Records...</p>
                                </div>
                            ) : error ? (
                                <div className="w-full bg-destructive/5 border border-destructive/20 p-12 rounded-[3rem] flex flex-col items-center text-center gap-4 backdrop-blur-md">
                                    <div className="w-16 h-16 rounded-3xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20 shadow-inner">
                                        <AlertTriangle className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xl font-black text-foreground">Sync Failure</p>
                                        <p className="text-sm text-muted-foreground font-medium max-w-xs mx-auto">{error}</p>
                                    </div>
                                </div>
                            ) : reports.length === 0 ? (
                                <div className="w-full py-24 px-10 bg-card/20 backdrop-blur-md border-2 border-dashed border-border/40 rounded-[3rem] flex flex-col items-center text-center gap-8 isolate">
                                    <div className="w-20 h-20 rounded-[2rem] bg-muted/40 flex items-center justify-center text-muted-foreground/30 shadow-inner">
                                        <Search className="w-10 h-10" />
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-black tracking-tight">No Inspections Found</h3>
                                        <p className="text-muted-foreground text-lg font-medium leading-relaxed max-w-xs mx-auto">
                                            Your field log is currently empty. Run your first hazard analysis now.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => router.push('/app')}
                                        className="h-14 px-10 bg-primary text-primary-foreground font-black rounded-2xl shadow-xl shadow-primary/25 hover:scale-[1.05] hover:rotate-1 transition-all active:scale-[0.98]"
                                    >
                                        Start Site Inspection
                                    </button>
                                </div>
                            ) : (
                                reports.map((report, idx) => (
                                    <motion.div
                                        key={report.$id}
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05, ease: "easeOut" }}
                                        className="group w-full p-6 md:p-8 rounded-[2rem] border bg-card/40 backdrop-blur-md border-border/50 hover:bg-card/70 hover:border-primary/30 transition-all cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.99]"
                                        onClick={() => router.push(`/report/${report.$id}`)}
                                    >
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                                            <div className="flex-1 space-y-5 min-w-0">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    {getSeverityBadge(report.severity)}
                                                    <div className="flex items-center text-[10px] font-black text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full uppercase tracking-widest border border-border/30">
                                                        <Clock className="w-3.5 h-3.5 mr-2 opacity-60" />
                                                        {new Date(report.$createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </div>
                                                    <div className="flex items-center text-[10px] font-black text-white bg-primary px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-primary/20">
                                                        <CheckCircle2 className="w-3.5 h-3.5 mr-2" />
                                                        {report.status}
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <h3 className="text-3xl font-black tracking-tighter text-foreground group-hover:text-primary transition-colors leading-none">
                                                        {report.projectName || "Project Audit"}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground text-sm font-bold">
                                                        <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-primary/60 outline-primary" />{report.inspectionLocation || "Primary Site"}</span>
                                                        <span className="opacity-20 hidden md:block w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                                                        <span className="truncate line-clamp-1 opacity-80 max-w-[400px]">{report.description || "Analysis report pending detailed review."}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center self-end md:self-center">
                                                <div className="w-14 h-14 rounded-2xl bg-primary/5 text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shadow-sm flex items-center justify-center group-hover:rotate-12">
                                                    <ChevronRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                </main>
            </div>
        </AuthGuard>
    );
}
