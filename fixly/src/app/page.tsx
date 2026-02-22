"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NavBar } from "../components/NavBar";
import { ArrowRight, Zap, Shield, Sparkles, Layers, ScanSearch, Clock } from "lucide-react";

export default function Home() {
  const containerVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: import("framer-motion").Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    },
  };

  return (
    <>
      <NavBar />
      <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-32 pb-20 mx-auto max-w-7xl">

        {/* HERO SECTION */}
        <motion.section
          className="flex flex-col items-center text-center max-w-4xl w-full mb-32"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium rounded-full bg-primary/10 text-primary ring-1 ring-primary/20">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Construction Safety</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-8 text-foreground"
          >
            Fix hazards,<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-amber-500 to-yellow-400 dark:from-primary dark:via-amber-500 dark:to-yellow-400">
              in a snap.
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl leading-relaxed"
          >
            Instantly analyze construction hazards from photos. Fixly generates expert remediation plans and automatically creates procurement lists to keep your site safe, compliant, and moving forward.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link
              href="/app"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_0_20px_rgba(var(--color-primary),0.3)] transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(var(--color-primary),0.5)] active:scale-95"
            >
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border/50 bg-background/50 backdrop-blur-md px-8 py-4 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-muted/50 active:scale-95"
            >
              Learn more
            </Link>
          </motion.div>
        </motion.section>

        {/* BENTO BOX FEATURES SECTION */}
        <motion.section
          className="w-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="text-center mb-16">
            <motion.h2 variants={itemVariants} className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              Built for the field.
            </motion.h2>
            <motion.p variants={itemVariants} className="text-muted-foreground text-lg max-w-xl mx-auto">
              Snap a photo of any site hazard. We handle the analysis, compliance, and paperwork instantly.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-gradient-to-br from-card/80 to-card/40 p-8 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-primary/10 blur-[80px] group-hover:bg-primary/25 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Instant Hazard Analysis</h3>
                  <p className="text-muted-foreground text-sm">Upload a photo and let AI identify structural risks, safety violations, and OSHA compliances in seconds.</p>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-gradient-to-br from-card/80 to-card/40 p-8 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-primary/10 blur-[80px] group-hover:bg-primary/25 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Smart Remediation</h3>
                  <p className="text-muted-foreground text-sm">Get step-by-step, actionable plans to fix identified hazards safely and effectively.</p>
                </div>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-gradient-to-br from-card/80 to-card/40 p-8 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-primary/10 blur-[80px] group-hover:bg-primary/25 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Auto Procurement</h3>
                  <p className="text-muted-foreground text-sm">Automatically generates a list of required materials and specialized tools for every repair.</p>
                </div>
              </div>
            </motion.div>

            {/* Feature 4 */}
            <motion.div
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-gradient-to-br from-card/80 to-card/40 p-8 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-primary/10 blur-[80px] group-hover:bg-primary/25 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <ScanSearch className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Bounding Box Detection</h3>
                  <p className="text-muted-foreground text-sm">AI pinpoints exact hazard locations on images with precision bounding boxes for crystal-clear identification.</p>
                </div>
              </div>
            </motion.div>

            {/* Feature 5 */}
            <motion.div
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-gradient-to-br from-card/80 to-card/40 p-8 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-primary/10 blur-[80px] group-hover:bg-primary/25 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Complexity Forecasting</h3>
                  <p className="text-muted-foreground text-sm">Get labor hour estimates, skill level requirements, and time ranges so you can plan resources accurately.</p>
                </div>
              </div>
            </motion.div>

            {/* Feature 6 */}
            <motion.div
              variants={itemVariants}
              className="group relative overflow-hidden rounded-3xl border border-white/20 dark:border-white/10 bg-gradient-to-br from-card/80 to-card/40 p-8 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 rounded-full bg-primary/20 blur-[80px] group-hover:bg-primary/30 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Historical Audit Logs</h3>
                  <p className="text-muted-foreground text-sm">A comprehensive system of record for all site safety reports to ensure continuous compliance.</p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

      </main>
    </>
  );
}
