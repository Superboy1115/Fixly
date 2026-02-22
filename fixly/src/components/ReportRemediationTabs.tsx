"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, AlertOctagon, Hammer, Wrench, Clock, ShieldAlert } from 'lucide-react';

interface RemediationPlan {
    fixSteps: string[];
    materialsList?: string[];
    tooling?: string[];
    safetyWarning?: string;
    complexity: {
        skillLevel?: string;
        laborHours?: number;
        laborHoursRange?: string;
    };
}

export function ReportRemediationTabs({ plan, description }: { plan: RemediationPlan, description: string }) {
    const [activeTab, setActiveTab] = useState<'analysis' | 'steps' | 'procurement' | 'complexity'>('analysis');

    const tabs = [
        { key: 'analysis' as const, label: 'Analysis' },
        { key: 'steps' as const, label: 'Remediation' },
        { key: 'procurement' as const, label: 'Materials' },
        { key: 'complexity' as const, label: 'Complexity' },
    ];

    return (
        <div className="border rounded-2xl bg-card/40 backdrop-blur-md shadow-sm overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex border-b bg-muted/20">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex-1 px-4 py-3.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 ${activeTab === tab.key
                                ? 'border-primary text-primary bg-background/80'
                                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'analysis' && (
                        <motion.div
                            key="analysis"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <ShieldAlert className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold tracking-tight text-foreground">Inspector Assessment</h2>
                            </div>
                            <div className="bg-muted/40 p-5 rounded-xl border border-border/50">
                                <p className="text-foreground text-sm leading-relaxed">{description}</p>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'steps' && (
                        <motion.div
                            key="steps"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <ClipboardList className="w-5 h-5 text-amber-500" />
                                <h2 className="text-lg font-bold tracking-tight text-foreground">Remediation Steps</h2>
                            </div>

                            {plan.safetyWarning && (
                                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-start gap-3">
                                    <AlertOctagon className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                                    <p className="text-sm text-foreground/90 leading-relaxed font-medium">{plan.safetyWarning}</p>
                                </div>
                            )}

                            <ol className="list-decimal list-outside ml-5 space-y-3 text-sm text-muted-foreground">
                                {plan.fixSteps.map((step: string, idx: number) => (
                                    <li key={idx} className="leading-relaxed pl-2">
                                        <span className="text-foreground font-medium">{step}</span>
                                    </li>
                                ))}
                            </ol>
                        </motion.div>
                    )}

                    {activeTab === 'procurement' && (
                        <motion.div
                            key="procurement"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <Hammer className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold tracking-tight text-foreground">Materials & Tooling</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 rounded-xl border bg-muted/30">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Required Materials</p>
                                    <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-foreground">
                                        {plan.materialsList?.map((mat: string, idx: number) => (
                                            <li key={idx} className="pl-1 leading-relaxed">{mat}</li>
                                        ))}
                                    </ul>
                                </div>

                                {plan.tooling && plan.tooling.length > 0 && (
                                    <div className="p-4 rounded-xl border bg-muted/30">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-3">Specialized Tools</p>
                                        <ul className="list-disc list-outside ml-4 space-y-2 text-sm text-foreground">
                                            {plan.tooling.map((tool: string, idx: number) => (
                                                <li key={idx} className="pl-1 leading-relaxed">{tool}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'complexity' && (
                        <motion.div
                            key="complexity"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-primary" />
                                <h2 className="text-lg font-bold tracking-tight text-foreground">Complexity Forecast</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-muted/30 rounded-xl p-5 border flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Required Skill</p>
                                        <p className="text-lg font-bold text-foreground">{plan.complexity.skillLevel || "N/A"}</p>
                                    </div>
                                    <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center">
                                        <Wrench className="w-5 h-5 text-primary" />
                                    </div>
                                </div>
                                <div className="bg-muted/30 rounded-xl p-5 border flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Est. Time</p>
                                        <p className="text-lg font-bold text-foreground">
                                            {plan.complexity.laborHoursRange
                                                ? `${plan.complexity.laborHoursRange} HRS`
                                                : plan.complexity.laborHours
                                                    ? `${plan.complexity.laborHours} HRS`
                                                    : "N/A"}
                                        </p>
                                    </div>
                                    <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-amber-500" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
