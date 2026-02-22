"use client";

import { motion } from "framer-motion";
import { NavBar } from "../../components/NavBar";

export default function About() {
    const containerVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
    };

    const itemVariants: import("framer-motion").Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    const team = [
        {
            name: "Sai Suhas Kaviti",
            role: "Co-Founder",
            bio: "A massive Google & Rivian fanboy, Sai is obsessed with engineering excellence and clean design. He pushes the boundaries of modern UX to ensure Fixly isn't just a powerful tool, but an absolute joy for construction teams to use every day."
        },
        {
            name: "Aditya Bang",
            role: "Co-Founder",
            bio: "A competitive chess player and hardcore coder, Aditya approaches software architecture like a grandmaster attacking the board. He writes the battle-tested, highly optimized code that makes Fixly lightning-fast and universally reliable."
        }
    ];

    return (
        <>
            <NavBar />
            <main className="flex flex-col items-center justify-center min-h-screen px-4 pt-32 pb-20 mx-auto max-w-5xl">

                <motion.section
                    className="text-center w-full mb-24"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-8"
                    >
                        Built for the future. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">Built by humans.</span>
                    </motion.h1>

                    <motion.div variants={itemVariants} className="max-w-prose mx-auto text-left md:text-center mt-12">
                        <p className="text-xl md:text-2xl leading-relaxed text-muted-foreground font-medium">
                            We believe that powerful tools don't have to be complicated. We built Fixly because we know the problems construction workers face every day. Between tight deadlines and rigorous safety standards, managing site hazards shouldn't require piles of paperwork. Our mission is to eliminate that friction by bringing AI-powered safety analysis directly to the field.
                        </p>
                    </motion.div>
                </motion.section>

                <motion.section
                    className="w-full"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    <motion.h2 variants={itemVariants} className="text-2xl md:text-4xl font-bold mb-12 text-center">
                        Our Team
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {team.map((member, i) => (
                            <motion.div
                                key={i}
                                variants={itemVariants}
                                className="group flex flex-col items-center text-center p-8 rounded-3xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 shadow-sm backdrop-blur-xl transition-all hover:-translate-y-2 hover:shadow-md"
                            >
                                {/* Duotone Avatar Placeholder */}
                                <div className="w-24 h-24 rounded-full mb-6 bg-gradient-to-br from-primary/20 to-secondary/50 dark:from-primary/30 dark:to-purple-900/40 relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                    <div className="absolute inset-x-2 bottom-0 h-10 bg-foreground/10 rounded-t-full mix-blend-overlay" />
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-foreground/10 mix-blend-overlay" />
                                </div>
                                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                                <p className="text-primary font-medium mb-4 text-sm uppercase tracking-wider">{member.role}</p>
                                <p className="text-muted-foreground text-sm leading-relaxed">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

            </main>
        </>
    );
}
