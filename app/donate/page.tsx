"use client";

import { useState } from "react";
import DonationModal from "@/components/DonationModal";
import { HandHeart, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function DonatePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-brand-green/5 blur-[150px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-brand-green/10 blur-[120px] rounded-full" />
            </div>

            <div className="z-10 w-full max-w-4xl text-center space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-6"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 mb-4">
                        <Heart size={16} fill="currentColor" />
                        <span className="text-sm font-medium uppercase tracking-wider">Community Treasury</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
                        Fuel the <span className="text-brand-green">Change</span>.
                    </h1>

                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                        Your donation directly funds the Parallel Pantry treasury. Every dollar is tracked on-chain and distributed instantly to verified community members in need.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
                >
                    {/* Recent Impact Stats (Mock) */}
                    <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-2 backdrop-blur-sm hover:bg-neutral-900/80 transition-colors">
                        <div className="text-3xl font-bold text-white">$12,450</div>
                        <div className="text-sm text-neutral-500 uppercase tracking-widest font-semibold">Total Raised</div>
                    </div>

                    <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-2 backdrop-blur-sm hover:bg-neutral-900/80 transition-colors">
                        <div className="text-3xl font-bold text-white">248</div>
                        <div className="text-sm text-neutral-500 uppercase tracking-widest font-semibold">Families Helped</div>
                    </div>

                    <div className="bg-neutral-900/50 border border-neutral-800 p-6 rounded-2xl flex flex-col items-center gap-2 backdrop-blur-sm hover:bg-neutral-900/80 transition-colors">
                        <div className="text-3xl font-bold text-brand-green">100%</div>
                        <div className="text-sm text-neutral-500 uppercase tracking-widest font-semibold">Transparency</div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="pt-8"
                >
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative inline-flex items-center gap-3 bg-white text-black px-10 py-5 rounded-full font-bold text-lg hover:bg-neutral-200 transition-all active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.4)]"
                    >
                        <HandHeart className="w-6 h-6 text-brand-green group-hover:scale-110 transition-transform" />
                        Support the Pool
                    </button>

                    <p className="mt-4 text-sm text-neutral-500 flex items-center justify-center gap-2">
                        <Users size={14} />
                        Join 1,204 other donors today
                    </p>
                </motion.div>
            </div>

            <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
