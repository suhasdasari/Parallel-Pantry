"use client";

import { useState } from "react";
import CameraCapture from "@/components/CameraCapture";
import { CheckCircle, AlertTriangle, AlertOctagon } from "lucide-react";

interface AuditResult {
    score: number;
    reason: string;
    urgency: "low" | "medium" | "high";
}

export default function RequestPage() {
    const [result, setResult] = useState<AuditResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCapture = async (imageSrc: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch("/api/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageSrc }),
            });

            if (!response.ok) {
                throw new Error("Verification failed");
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            console.error(err);
            setError("Failed to verify proof. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (result) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground animate-in fade-in duration-500">
                <div className="w-full max-w-md bg-neutral-900 rounded-3xl p-8 border border-neutral-800 text-center space-y-6">
                    <div className="flex justify-center">
                        {result.score >= 85 ? (
                            <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-10 h-10 text-brand-green" />
                            </div>
                        ) : result.score >= 50 ? (
                            <div className="w-20 h-20 bg-brand-amber/20 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-10 h-10 text-brand-amber" />
                            </div>
                        ) : (
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                                <AlertOctagon className="w-10 h-10 text-red-500" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold">
                            Trust Score: {result.score}
                        </h2>
                        <p className="text-neutral-400 text-sm uppercase tracking-wider font-semibold">
                            Urgency: <span className={
                                result.urgency === "high" ? "text-red-500" :
                                    result.urgency === "medium" ? "text-brand-amber" :
                                        "text-neutral-500"
                            }>{result.urgency}</span>
                        </p>
                    </div>

                    <div className="bg-neutral-800/50 p-4 rounded-xl text-left">
                        <p className="text-neutral-300 italic text-sm">&quot;{result.reason}&quot;</p>
                    </div>

                    {result.score > 85 ? (
                        <button
                            onClick={() => alert("Proceeding to Settlement (Tempo L1) - Coming Soon")}
                            className="w-full py-4 bg-brand-green hover:bg-brand-green/90 text-white font-bold rounded-xl transition-all active:scale-95"
                        >
                            Request $50 Relief
                        </button>
                    ) : (
                        <button
                            onClick={() => setResult(null)}
                            className="w-full py-4 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-all"
                        >
                            Try Again
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-background text-foreground p-6">
            <div className="w-full max-w-md space-y-8 mt-10">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Request Relief</h1>
                    <p className="text-neutral-400">
                        Take a clear photo of your fridge, pantry, or utility bill as proof of need.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm text-center">
                        {error}
                    </div>
                )}

                <CameraCapture onCapture={handleCapture} isLoading={loading} />
            </div>
        </div>
    );
}
