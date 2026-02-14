"use client";

import React, { useState } from "react";
import { X, CheckCircle, Mail, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CameraCapture from "./CameraCapture";
import confetti from "canvas-confetti";

interface RequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: { image: string; email: string }) => void;
}

export default function RequestModal({ isOpen, onClose, onSuccess }: RequestModalProps) {
    const [step, setStep] = useState<"email" | "camera" | "processing" | "success">("email");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCapture = async (capturedImage: string) => {
        setImage(capturedImage);
        setStep("processing");
        setError(null);

        try {
            const response = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: capturedImage }),
            });

            if (!response.ok) throw new Error("Verification failed");

            const result = await response.json();

            if (result.score >= 85) {
                setStep("success");
                triggerConfetti();
                // Placeholder for Payout Grant function
                console.log("Payout Grant Triggered for:", email);
                if (onSuccess) onSuccess({ image: capturedImage, email });
            } else {
                setError(`AI Verification Failed: ${result.reason} (Score: ${result.score})`);
                setStep("camera"); // Allow retry
                setImage(null);
            }
        } catch (err: unknown) {
            console.error(err);
            setError("Failed to verify request. Please try again.");
            setStep("camera");
            setImage(null);
        }
    };

    const triggerConfetti = () => {
        const end = Date.now() + 3 * 1000;
        const colors = ["#10B981", "#F59E0B", "#ffffff"];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors,
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors,
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    };

    const reset = () => {
        setStep("email");
        setEmail("");
        setImage(null);
        setError(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden"
                    >
                        {/* Close Button */}
                        <button
                            onClick={reset}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors z-10"
                        >
                            <X size={20} />
                        </button>

                        <div className="p-6 md:p-8">
                            {step === "email" && (
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <div className="w-16 h-16 bg-brand-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Mail className="w-8 h-8 text-brand-amber" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white">Request Relief</h2>
                                        <p className="text-neutral-400 text-sm">
                                            Enter your email to get started. We use this to verify your identity.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-neutral-300 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl py-3 px-4 text-white placeholder:text-neutral-600 focus:outline-none focus:border-brand-amber/50 focus:ring-1 focus:ring-brand-amber/50 transition-all"
                                        />
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (email) setStep("camera");
                                        }}
                                        disabled={!email}
                                        className="w-full bg-brand-amber hover:bg-brand-amber/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all active:scale-95"
                                    >
                                        Continue to Verification
                                    </button>
                                </div>
                            )}

                            {(step === "camera" || step === "processing") && (
                                <div className="space-y-6">
                                    <div className="text-center space-y-2">
                                        <h2 className="text-2xl font-bold text-white">Proof of Need</h2>
                                        <p className="text-neutral-400 text-sm">
                                            Take a clear photo of your fridge, pantry, or utility bill.
                                        </p>
                                    </div>

                                    {error && (
                                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center">
                                            {error}
                                        </div>
                                    )}

                                    <CameraCapture
                                        onCapture={handleCapture}
                                        isLoading={step === "processing"}
                                    />

                                    {step === "processing" && (
                                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20 rounded-3xl">
                                            <Loader2 className="w-12 h-12 text-brand-green animate-spin mb-4" />
                                            <h3 className="text-xl font-bold">AI Auditor Analyzing...</h3>
                                            <p className="text-neutral-300 text-sm">Verifying proof for instant relief.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === "success" && (
                                <div className="text-center space-y-6 py-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                        className="w-24 h-24 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto overflow-hidden border-2 border-brand-green relative"
                                    >
                                        {image ? (
                                            <img src={image} alt="Approved" className="w-full h-full object-cover" />
                                        ) : (
                                            <CheckCircle className="w-12 h-12 text-brand-green" />
                                        )}
                                    </motion.div>

                                    <div className="space-y-2">
                                        <h2 className="text-3xl font-bold text-white">Relief Approved!</h2>
                                        <p className="text-neutral-400">
                                            Your request has been verified. <span className="text-brand-green font-bold">$50.00</span> is being sent to your wallet.
                                        </p>
                                    </div>

                                    <button
                                        onClick={reset}
                                        className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-all w-full"
                                    >
                                        Close & View Gallery
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
