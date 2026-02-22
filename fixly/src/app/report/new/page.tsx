'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Image as ImageIcon, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { submitHazardReport } from '@/app/actions/analyzeHazard';
import Link from 'next/link';

export default function NewReportPage() {
    const router = useRouter();
    const [image, setImage] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

    const handleSubmit = async () => {
        if (!file) return;
        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const result = await submitHazardReport(formData);

            if (result.success && result.docId) {
                router.push(`/report/${result.docId}`);
            } else {
                setError(result.error || 'Failed to submit report. Ensure Appwrite and Gemini are configured.');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm pt-10 pb-4 px-4 sticky top-0 z-10 flex items-center gap-3">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <ArrowLeft className="h-5 w-5 text-gray-700" />
                    </Button>
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">New Safety Report</h1>
            </header>

            <div className="flex-1 p-4 flex flex-col gap-6 w-full max-w-md mx-auto mt-4">

                {!image ? (
                    <Card className="border-dashed border-2 bg-transparent shadow-none border-gray-300">
                        <CardContent className="flex flex-col items-center justify-center p-8 min-h-[300px] text-center gap-4">
                            <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-2">
                                <Camera className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Capture Hazard</h3>
                                <p className="text-sm text-gray-500 mt-1 mb-6">Take a clear photo of the workplace safety issue.</p>
                            </div>

                            <div className="flex gap-3 w-full">
                                <Button
                                    className="flex-1 h-12 bg-amber-600 hover:bg-amber-700"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Camera className="mr-2 h-5 w-5" /> Take Photo
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="relative rounded-xl overflow-hidden shadow-sm bg-black flex items-center justify-center min-h-[400px]">
                        <img src={image} className="w-full object-contain max-h-[60vh] opacity-90" alt="Preview" />

                        {!isSubmitting && (
                            <Button
                                variant="secondary"
                                size="sm"
                                className="absolute top-4 right-4 bg-white/90 text-gray-800 hover:bg-white"
                                onClick={() => {
                                    setImage(null);
                                    setFile(null);
                                }}
                            >
                                Retake
                            </Button>
                        )}

                        {isSubmitting && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center z-10">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 rounded-full border-t-2 border-r-2 border-amber-400 animate-spin"></div>
                                    <div className="absolute inset-2 rounded-full border-b-2 border-l-2 border-white animate-spin-reverse"></div>
                                    <Loader2 className="h-12 w-12 animate-pulse text-amber-300" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Fixly AI Analyzing</h3>
                                <p className="text-sm text-gray-300 max-w-[250px]">
                                    Scanning image for hazards, assessing severity, and calculating safety perimeter...
                                </p>
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
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                        {error}
                    </div>
                )}

            </div>

            {image && !isSubmitting && (
                <div className="p-4 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sticky bottom-0 z-10 w-full max-w-md mx-auto">
                    <Button
                        onClick={handleSubmit}
                        className="w-full h-14 text-lg font-semibold bg-amber-600 hover:bg-amber-700 shadow-md transition-transform active:scale-[0.98]"
                    >
                        Analyze & Report
                    </Button>
                </div>
            )}
        </main>
    );
}
