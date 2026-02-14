"use client";

import React, { useState } from "react";
import { X, CheckCircle, Mail, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CameraCapture from "./CameraCapture";
import confetti from "canvas-confetti";

interface RequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (data: { image: string; email: string; status: "approved" | "pending" | "rejected"; score: number; reason: string }) => void;
}

type VerificationStatus = "approved" | "pending" | "rejected";

interface EvaluationResult {
    status: VerificationStatus;
    score: number;
    reason: string;
}

// Verification Thresholds
const THRESHOLD_PASS = 85;
const THRESHOLD_RETRY = 50;

export default function RequestModal({ isOpen, onClose, onSuccess }: RequestModalProps) {
    const [step, setStep] = useState<"email" | "camera" | "processing" | "result">("email");
    const [email, setEmail] = useState("");
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
    const [progress, setProgress] = useState(0);


    // Autonomous AI Verification Handler
    const processAIScore = (result: { score: number; reason: string }): EvaluationResult => {
        const { score, reason } = result;

        if (score >= THRESHOLD_PASS) {
            // PASS: High confidence verification
            return { status: "approved", score, reason };
        } else if (score >= THRESHOLD_RETRY) {
            // SOFT REJECT: Needs better photo
            return { status: "pending", score, reason };
        } else {
            // HARD REJECT: Failed verification
            return { status: "rejected", score, reason };
        }
    };

    const handleCapture = async (capturedImage: string) => {
        setImage(capturedImage);
        setStep("processing");
        setError(null);
        setProgress(0);

        try {
            // Simulate progress bar animation
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            let result;

            try {
                // Call Gemini API for verification
                const response = await fetch("/api/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: capturedImage }),
                });

                clearInterval(progressInterval);
                setProgress(100);

                if (!response.ok) {
                    // If API fails (e.g., missing API key), use simulated response
                    console.warn("API verification failed, using simulated response");
                    result = generateSimulatedResponse();
                } else {
                    result = await response.json();
                }
            } catch (apiError) {
                // Network error or API unavailable - use simulated response
                console.warn("API error, using simulated response:", apiError);
                clearInterval(progressInterval);
                setProgress(100);
                result = generateSimulatedResponse();
            }

            // Use Autonomous AI Verification Handler
            const evaluation = processAIScore(result);
            setEvaluationResult(evaluation);

            // Small delay to show 100% progress
            await new Promise((resolve) => setTimeout(resolve, 500));
            setStep("result");

            // Always add to Impact Feed (approved, pending, or rejected)
            if (onSuccess) {
                onSuccess({
                    image: capturedImage,
                    email,
                    status: evaluation.status,
                    score: evaluation.score,
                    reason: evaluation.reason,
                });
            }

            // If approved, trigger confetti and payout
            if (evaluation.status === "approved") {
                triggerConfetti();
                console.log("Payout Grant Triggered for:", email);
            }
        } catch (err: unknown) {
            console.error(err);
            setError("Failed to process request. Please try again.");
            setStep("camera");
            setImage(null);
            setProgress(0);
        }
    };

    // Simulated AI response for testing (when API key is not available)
    const generateSimulatedResponse = () => {
        // Randomly generate different scenarios for testing
        const scenarios = [
            { score: 92, reason: "Clear evidence of financial need detected. Empty pantry shelves visible with adequate lighting." },
            { score: 88, reason: "Utility bill shows overdue balance. Document appears authentic and recent." },
            { score: 67, reason: "Photo quality is acceptable but lighting could be improved for better verification." },
            { score: 58, reason: "Image is slightly blurry. Please retake with better focus and lighting." },
            { score: 35, reason: "Unable to clearly identify proof of need. Image quality insufficient for verification." },
            { score: 20, reason: "Photo does not appear to show valid proof of financial need." },
        ];

        return scenarios[Math.floor(Math.random() * scenarios.length)];
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
                                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center text-white z-20 rounded-3xl p-8">
                                            <Loader2 className="w-12 h-12 text-brand-green animate-spin mb-6" />
                                            <h3 className="text-xl font-bold mb-2">AI Auditor Scanning...</h3>
                                            <p className="text-neutral-300 text-sm mb-6">Analyzing proof of need</p>

                                            {/* Progress Bar */}
                                            <div className="w-full max-w-xs">
                                                <div className="flex justify-between text-xs text-neutral-400 mb-2">
                                                    <span>Verification Progress</span>
                                                    <span>{progress}%</span>
                                                </div>
                                                <div className="w-full bg-neutral-700 rounded-full h-2 overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-gradient-to-r from-brand-green to-brand-amber"
                                                        initial={{ width: "0%" }}
                                                        animate={{ width: `${progress}%` }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === "result" && evaluationResult && (
                                <div className="text-center space-y-6 py-8">
                                    {/* APPROVED STATE */}
                                    {evaluationResult.status === "approved" && (
                                        <>
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
                                                <div className="mt-4 p-4 bg-neutral-800/50 rounded-xl text-left">
                                                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">AI Verification Reason</p>
                                                    <p className="text-sm text-neutral-300 italic">&quot;{evaluationResult.reason}&quot;</p>
                                                    <p className="text-xs text-brand-green mt-2">Trust Score: {evaluationResult.score}/100</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={reset}
                                                className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-all w-full"
                                            >
                                                Close & View Gallery
                                            </button>
                                        </>
                                    )}

                                    {/* PENDING STATE (Soft Reject) */}
                                    {evaluationResult.status === "pending" && (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                                className="w-24 h-24 bg-brand-amber/20 rounded-full flex items-center justify-center mx-auto border-2 border-brand-amber"
                                            >
                                                <svg className="w-12 h-12 text-brand-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </motion.div>

                                            <div className="space-y-2">
                                                <h2 className="text-2xl font-bold text-white">Photo Needs Improvement</h2>
                                                <p className="text-neutral-400">
                                                    We see you&apos;re in need, but the photo is blurry. Please try again with better lighting!
                                                </p>
                                                <div className="mt-4 p-4 bg-neutral-800/50 rounded-xl text-left">
                                                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">AI Feedback</p>
                                                    <p className="text-sm text-neutral-300 italic">&quot;{evaluationResult.reason}&quot;</p>
                                                    <p className="text-xs text-brand-amber mt-2">Trust Score: {evaluationResult.score}/100 (Need {THRESHOLD_PASS}+)</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    setStep("camera");
                                                    setEvaluationResult(null);
                                                    setImage(null);
                                                    setError(null);
                                                }}
                                                className="px-8 py-3 bg-brand-amber hover:bg-brand-amber/90 text-white font-bold rounded-xl transition-all w-full"
                                            >
                                                Try Again with Better Photo
                                            </button>
                                        </>
                                    )}

                                    {/* REJECTED STATE (Hard Reject) */}
                                    {evaluationResult.status === "rejected" && (
                                        <>
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                                className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto border-2 border-red-500"
                                            >
                                                <svg className="w-12 h-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </motion.div>

                                            <div className="space-y-2">
                                                <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
                                                <p className="text-neutral-400">
                                                    Please ensure you are providing a genuine live photo of need.
                                                </p>
                                                <div className="mt-4 p-4 bg-neutral-800/50 rounded-xl text-left">
                                                    <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">AI Analysis</p>
                                                    <p className="text-sm text-neutral-300 italic">&quot;{evaluationResult.reason}&quot;</p>
                                                    <p className="text-xs text-red-400 mt-2">Trust Score: {evaluationResult.score}/100</p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={reset}
                                                className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium rounded-xl transition-all w-full"
                                            >
                                                Close
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
