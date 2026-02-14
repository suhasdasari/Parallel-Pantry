"use client";

import { useEffect, useState } from "react";
import { Timer, Zap } from "lucide-react";

export default function ReliefTimer() {
    // 1 minute cycle (60 seconds)
    const CYCLE_TIME = 60;
    const [timeLeft, setTimeLeft] = useState(CYCLE_TIME);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Find how many seconds have passed in the current 10-min window based on system time
        // This ensures all clients are roughly synced
        const now = Math.floor(Date.now() / 1000);
        const elapsed = now % CYCLE_TIME;
        setTimeLeft(CYCLE_TIME - elapsed);

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    triggerBatchPayout();
                    return CYCLE_TIME;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const triggerBatchPayout = async () => {
        setIsProcessing(true);
        console.log("Relief Round Complete! Triggering parallel batch payouts...");

        try {
            const response = await fetch("/api/batch-payout", {
                method: "POST",
            });
            const data = await response.json();
            console.log("Batch payout result:", data);
        } catch (error) {
            console.error("Batch payout trigger failed:", error);
        } finally {
            // Small delay to show "Distributing" state
            setTimeout(() => setIsProcessing(false), 3000);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="flex items-center gap-3 bg-neutral-900/50 rounded-xl px-4 py-2 border border-brand-amber/30 group">
            <div className={`p-1.5 rounded-lg ${isProcessing ? 'bg-brand-green animate-pulse' : 'bg-brand-amber/20'}`}>
                {isProcessing ? (
                    <Zap className="w-4 h-4 text-black" />
                ) : (
                    <Timer className="w-4 h-4 text-brand-amber group-hover:rotate-12 transition-transform" />
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">
                    {isProcessing ? "Distributing" : "Next Relief Round"}
                </span>
                <span className={`text-sm font-mono font-bold ${isProcessing ? 'text-brand-green' : 'text-neutral-200'}`}>
                    {isProcessing ? "PARALLEL LANES ACTIVE" : formatTime(timeLeft)}
                </span>
            </div>
        </div>
    );
}
