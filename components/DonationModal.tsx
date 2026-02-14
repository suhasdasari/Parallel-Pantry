"use client";

import React, { useState } from "react";
import { Coins, ShieldCheck, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
    const [amount, setAmount] = useState("");
    const [donorName, setDonorName] = useState("");
    const [memo, setMemo] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    // Placeholder for Suhas's Tempo Integration
    const handleDonation = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate async transaction
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Processing donation...", { amount, donorName, memo });
        // TODO: Suhas - Integrate Tempo SDK here.
        // Use `amount` (pathUSD) and `memo` for the transaction payload.

        setLoading(false);
        setIsSuccess(true);
    };

    const reset = () => {
        setAmount("");
        setDonorName("");
        setMemo("");
        setIsSuccess(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={reset}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        {/* Modal Content */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                            className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative"
                        >
                            {/* Close Button */}
                            <button
                                onClick={reset}
                                className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {!isSuccess ? (
                                <form onSubmit={handleDonation} className="p-8 space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Coins className="w-8 h-8 text-brand-green" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">Support the Pool</h2>
                                        <p className="text-neutral-400 text-sm">
                                            Your contribution provides direct relief to community members.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Amount Input */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-300 ml-1">
                                                Donation Amount (pathUSD)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-medium">
                                                    $
                                                </span>
                                                <input
                                                    type="number"
                                                    value={amount}
                                                    onChange={(e) => setAmount(e.target.value)}
                                                    placeholder="50.00"
                                                    required
                                                    min="1"
                                                    step="0.01"
                                                    className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 pl-8 pr-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/50 transition-all font-mono text-lg"
                                                />
                                            </div>
                                        </div>

                                        {/* Name Input */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-300 ml-1">
                                                Donor Name <span className="text-neutral-500 font-normal">(Optional)</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={donorName}
                                                onChange={(e) => setDonorName(e.target.value)}
                                                placeholder="Anonymous Helper"
                                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/50 transition-all"
                                            />
                                        </div>

                                        {/* Memo Input */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-neutral-300 ml-1">
                                                Message of Support <span className="text-neutral-500 font-normal">(Optional)</span>
                                            </label>
                                            <textarea
                                                value={memo}
                                                onChange={(e) => setMemo(e.target.value)}
                                                placeholder="Stay strong! formatting..."
                                                rows={3}
                                                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-green/50 focus:ring-1 focus:ring-brand-green/50 transition-all resize-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !amount}
                                        className="w-full bg-brand-green hover:bg-brand-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <span className="loading-spinner w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Confirm Donation
                                                <ShieldCheck size={18} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            ) : (
                                <div className="p-12 text-center space-y-6">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                        className="w-24 h-24 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto"
                                    >
                                        <ShieldCheck className="w-12 h-12 text-brand-green" />
                                    </motion.div>

                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold text-white">Thank You!</h2>
                                        <p className="text-neutral-400">
                                            Your donation of <span className="text-brand-green font-bold">${amount}</span> has been processed.
                                        </p>
                                        <p className="text-neutral-500 text-sm">
                                            Transaction Hash: <span className="font-mono text-xs bg-neutral-800 px-2 py-1 rounded">0x123...abc</span>
                                        </p>
                                    </div>

                                    <button
                                        onClick={reset}
                                        className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-all w-full"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
