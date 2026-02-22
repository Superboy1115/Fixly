import { getReportById, deleteReport } from '@/app/actions/reports';
import { getImageUrl } from '@/lib/appwrite';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { NavBar } from '@/components/NavBar';
import { ReportRemediationTabs } from '@/components/ReportRemediationTabs';
import { ArrowLeft, AlertTriangle, Trash2, HardHat, MapPin, CheckCircle2, Clock } from 'lucide-react';

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const { success, document, error } = await getReportById(id);

    if (!success || !document) {
        return (
            <div className="min-h-screen bg-background text-foreground">
                <NavBar />
                <main className="max-w-3xl mx-auto px-6 pt-32 pb-20">
                    <div className="bg-destructive/10 border border-destructive text-destructive p-6 rounded-2xl flex flex-col items-center justify-center gap-4 text-center">
                        <AlertTriangle className="w-12 h-12" />
                        <div>
                            <h2 className="text-xl font-bold mb-2">Report Not Found</h2>
                            <p className="font-medium text-destructive/80">{error || 'The requested report does not exist.'}</p>
                        </div>
                        <Link href="/dashboard" className="px-6 py-2 bg-destructive text-destructive-foreground rounded-full font-semibold hover:opacity-90 transition-opacity">
                            Return to Dashboard
                        </Link>
                    </div>
                </main>
            </div>
        );
    }

    const imageUrl = document.imageId ? getImageUrl(document.imageId) : null;

    // Parse bounding box coordinates
    let coordinates: number[] = [];
    try {
        if (document.coordinates) {
            coordinates = JSON.parse(document.coordinates);
        }
    } catch (e) { }

    const [ymin, xmin, ymax, xmax] = coordinates.length === 4 ? coordinates : [0, 0, 0, 0];
    const boxTop = `${ymin * 100}%`;
    const boxLeft = `${xmin * 100}%`;
    const boxHeight = `${(ymax - ymin) * 100}%`;
    const boxWidth = `${(xmax - xmin) * 100}%`;
    const hasBoundingBox = coordinates.length === 4 && boxWidth !== '0%';

    // Parse remediation plan
    let remediationPlan = null;
    try {
        if (document.remediationPlan) {
            const parsed = typeof document.remediationPlan === 'string'
                ? JSON.parse(document.remediationPlan)
                : document.remediationPlan;
            if (parsed && parsed.fixSteps) {
                remediationPlan = parsed;
            }
        }
    } catch (e) { }

    function getSeverityColor(severity: string) {
        switch (severity?.toLowerCase()) {
            case 'critical': return 'text-red-600 bg-red-500/10 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-500/30';
            case 'high': return 'text-orange-600 bg-orange-500/10 border-orange-200 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/30';
            case 'medium': return 'text-yellow-600 bg-yellow-500/10 border-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/30';
            case 'low': return 'text-green-600 bg-green-500/10 border-green-200 dark:bg-green-500/20 dark:text-green-400 dark:border-green-500/30';
            default: return 'text-gray-600 bg-gray-100 border-gray-200 dark:bg-zinc-800 dark:text-gray-300 dark:border-zinc-700';
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <NavBar />

            <main className="max-w-5xl mx-auto px-6 pt-28 pb-20">
                <div className="flex flex-col gap-6">

                    {/* Top Bar: Back + Title + Meta */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                    <HardHat className="w-6 h-6 text-primary" />
                                    {document.projectName || "Site Inspection"}
                                </h1>
                                <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-primary/60" />
                                        {document.inspectionLocation || "Primary Site"}
                                    </span>
                                    <span className="opacity-30">•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 opacity-60" />
                                        {new Date(document.$createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center text-primary font-bold text-[11px] bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wider">
                                <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                {document.status}
                            </div>
                            <div className={`px-3 py-1 text-[11px] font-bold rounded-full border uppercase tracking-wider ${getSeverityColor(document.severity)}`}>
                                {document.severity}
                            </div>
                        </div>
                    </div>

                    {/* Image with Bounding Box — Full Width */}
                    {imageUrl && (
                        <div className="rounded-2xl overflow-hidden bg-black/5 dark:bg-black/40 border shadow-inner p-4 flex items-center justify-center">
                            <div className="relative inline-block max-w-full">
                                <img
                                    src={imageUrl}
                                    alt="Site Photo"
                                    className="block max-w-full max-h-[60vh] object-contain rounded-xl shadow-md"
                                />
                                {hasBoundingBox && (
                                    <div
                                        className="absolute border-2 sm:border-[3px] border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.6)] bg-red-500/15 z-10 pointer-events-none rounded-sm animate-pulse"
                                        style={{ top: boxTop, left: boxLeft, width: boxWidth, height: boxHeight }}
                                    >
                                        <div className="absolute -top-6 left-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm whitespace-nowrap">
                                            Detected Hazard
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tabbed Details Panel */}
                    {remediationPlan && (
                        <ReportRemediationTabs plan={remediationPlan} description={document.description || ""} />
                    )}

                    {/* If no remediation plan, just show description */}
                    {!remediationPlan && document.description && (
                        <div className="p-6 rounded-2xl border bg-card/40 backdrop-blur-md shadow-sm">
                            <h3 className="font-bold text-sm mb-3">Assessment</h3>
                            <p className="text-sm text-foreground leading-relaxed">{document.description}</p>
                        </div>
                    )}

                    {/* Delete */}
                    <form action={async () => {
                        'use server';
                        await deleteReport(id, document.imageId);
                        redirect('/dashboard');
                    }}>
                        <button type="submit" className="w-full group flex items-center justify-center gap-2 h-10 rounded-xl border border-destructive/30 bg-destructive/5 text-destructive/70 text-sm font-semibold hover:bg-destructive hover:text-white transition-all">
                            <Trash2 className="w-4 h-4" />
                            Delete This Record
                        </button>
                    </form>

                </div>
            </main>
        </div>
    );
}
