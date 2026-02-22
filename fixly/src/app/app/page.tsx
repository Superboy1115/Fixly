"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NavBar } from "../../components/NavBar";
import { useAuth } from "../../components/AuthProvider";
import { AuthGuard } from "../../components/AuthGuard";
import { UploadCloud, HardHat, Loader2, AlertTriangle, Building2, MapPin, Camera, X, Shield } from "lucide-react";
import { submitHazardReport } from "../../app/actions/analyzeHazard";

export default function FixPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [projectName, setProjectName] = useState("Downtown Tower Expansion");
    const [inspectionLocation, setInspectionLocation] = useState("Sector B - Scaffolding");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(selectedFile);
            setError(null);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile && droppedFile.type.startsWith("image/")) {
            setFile(droppedFile);
            const reader = new FileReader();
            reader.onload = (e) => setImage(e.target?.result as string);
            reader.readAsDataURL(droppedFile);
            setError(null);
        }
    };

    const handleSubmit = async () => {
        if (!file || !user) {
            setError(!user ? "Please sign in first." : "Please upload an image first.");
            return;
        }
        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("image", file);
            formData.append("projectName", projectName);
            formData.append("inspectionLocation", inspectionLocation);
            formData.append("userId", user.$id);

            const result = await submitHazardReport(formData);

            if (result.success && result.docId) {
                router.push(`/report/${result.docId}`);
            } else if (result.invalidImage) {
                setError(result.description || "This image does not appear to be construction-related.");
                setIsSubmitting(false);
            } else {
                setError(result.error || "Failed to submit report. Please try again.");
                setIsSubmitting(false);
            }
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
            setIsSubmitting(false);
        }
    };

    return (
        <AuthGuard>
            <NavBar />
            <main className="flex flex-col min-h-screen items-center justify-center px-4 pt-28 pb-20">
                <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full max-w-lg flex flex-col items-center"
                >
                    <div className="flex flex-col items-center text-center mb-10">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-sm mb-6"
                        >
                            <HardHat className="w-8 h-8" />
                        </motion.div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground leading-[0.9]">
                            Submit Inspection<span className="text-primary truncate">.</span>
                        </h1>
                        <p className="text-muted-foreground mt-4 text-lg max-w-md leading-relaxed">
                            Upload a site photo and our AI inspector will analyze it for multiple hazards and safety violations.
                        </p>
                    </div>

                    <div className="w-full p-8 rounded-[2.5rem] border bg-card/40 backdrop-blur-md border-border/50 shadow-xl space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <Building2 className="w-3 h-3 text-primary" /> Project Name
                                </label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                                    <MapPin className="w-3 h-3 text-primary" /> Inspection Zone
                                </label>
                                <input
                                    type="text"
                                    value={inspectionLocation}
                                    onChange={(e) => setInspectionLocation(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-inner"
                                />
                            </div>
                        </div>

                        {!image ? (
                            <div
                                className="group relative flex flex-col items-center justify-center p-12 border-2 border-dashed border-border/60 rounded-[2rem] bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all cursor-pointer overflow-hidden isolate"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform shadow-inner">
                                    <UploadCloud className="w-7 h-7" />
                                </div>
                                <p className="font-bold text-foreground text-lg">Drop image here</p>
                                <p className="text-sm text-muted-foreground mt-1 font-medium">Or click to browse from device</p>
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-background/50 px-3 py-1 rounded-full border">
                                    <Shield className="w-3 h-3" /> Encrypted Upload
                                </div>
                            </div>
                        ) : (
                            <div className="relative rounded-[2rem] overflow-hidden border bg-black/5 dark:bg-black/30 shadow-2xl">
                                <img src={image} className="w-full h-64 md:h-80 object-cover" alt="Upload Preview" />
                                {!isSubmitting && (
                                    <button
                                        onClick={() => { setImage(null); setFile(null); setError(null); }}
                                        className="absolute top-4 right-4 h-10 w-10 rounded-2xl bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors flex items-center justify-center border border-white/10 shadow-lg"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                                {isSubmitting && (
                                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center">
                                        <div className="relative">
                                            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                                            <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary/20" />
                                        </div>
                                        <p className="text-lg font-black text-foreground tracking-tight">AI Analysis in Progress</p>
                                        <p className="text-xs text-muted-foreground mt-1 font-bold uppercase tracking-widest">Scanning for multiple hazards...</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-5 bg-destructive/10 text-destructive text-sm rounded-2xl border border-destructive/20 font-bold flex items-start gap-4 shadow-sm"
                            >
                                <div className="p-2 rounded-xl bg-destructive/20 mt-0.5">
                                    <AlertTriangle className="w-4 h-4" />
                                </div>
                                <div className="space-y-1">
                                    <p className="uppercase tracking-widest text-[10px] opacity-80">Inspection Error</p>
                                    <p className="leading-relaxed">{error}</p>
                                </div>
                            </motion.div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={!file || isSubmitting}
                            className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-black text-lg shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Camera className="w-5 h-5" />
                                    Analyze Site Safety
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </main>
        </AuthGuard>
    );
}
