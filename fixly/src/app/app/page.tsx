"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { NavBar } from "../../components/NavBar";
import { useAuth } from "../../components/AuthProvider";
import { UploadCloud, HardHat, Loader2, AlertTriangle, Building2, MapPin, Camera, X } from "lucide-react";
import { submitHazardReport } from "../../app/actions/analyzeHazard";

export default function FixPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [projectName, setProjectName] = useState("Downtown Tower Expansion");
    const [inspectionLocation, setInspectionLocation] = useState("Sector B - Scaffolding");
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

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

    if (loading || !user) {
        return (
            <>
                <NavBar />
                <main className="flex flex-col min-h-screen items-center justify-center">
                    <div className="w-10 h-10 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </main>
            </>
        );
    }

    return (
        <>
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
                        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
                            Submit Inspection
                        </h1>
                        <p className="text-muted-foreground mt-2 text-lg max-w-md leading-relaxed">
                            Upload a site photo and our AI inspector will analyze it for hazards.
                        </p>
                    </div>

                    <div className="w-full p-8 rounded-3xl border bg-card/40 backdrop-blur-md border-border/50 shadow-xl space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-primary" /> Project Name
                                </label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" /> Inspection Zone
                                </label>
                                <input
                                    type="text"
                                    value={inspectionLocation}
                                    onChange={(e) => setInspectionLocation(e.target.value)}
                                    className="w-full h-11 px-4 bg-background border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="border-t border-border/50" />

                        {!image ? (
                            <div
                                className="group relative flex flex-col items-center justify-center p-10 border-2 border-dashed border-border rounded-2xl bg-muted/20 hover:bg-muted/40 hover:border-primary/40 transition-all cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-7 h-7" />
                                </div>
                                <p className="font-semibold text-foreground">Drop image here or click to browse</p>
                                <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WEBP — max 10MB</p>
                            </div>
                        ) : (
                            <div className="relative rounded-2xl overflow-hidden border bg-black/5 dark:bg-black/30">
                                <img src={image} className="w-full h-56 object-cover" alt="Upload Preview" />
                                {!isSubmitting && (
                                    <button
                                        onClick={() => { setImage(null); setFile(null); setError(null); }}
                                        className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                                {isSubmitting && (
                                    <div className="absolute inset-0 bg-background/80 backdrop-blur-md flex flex-col items-center justify-center">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                                        <p className="text-sm font-semibold text-foreground">Analyzing for hazards...</p>
                                        <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
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
                            <div className="p-4 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 font-medium flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleSubmit}
                            disabled={!file || isSubmitting}
                            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Inspecting...
                                </>
                            ) : (
                                <>
                                    <Camera className="w-4 h-4" />
                                    Analyze Site Safety
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </main>
        </>
    );
}
