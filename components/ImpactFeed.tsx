"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

export interface ImpactRequest {
    id: string;
    imageSrc: string;
    timestamp: Date;
    verified: boolean;
    status: "approved" | "pending" | "rejected";
    score: number;
    reason: string;
}

interface ImpactFeedProps {
    requests: ImpactRequest[];
}

export default function ImpactFeed({ requests }: ImpactFeedProps) {
    if (requests.length === 0) {
        return (
            <div className="text-center py-12 text-neutral-500">
                <p>No recent relief requests. Be the first to help or request.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-12">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Live Audit Log</h2>
                <p className="text-neutral-400">Real-time AI verification transparency</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <AnimatePresence mode="popLayout">
                    {requests.map((req, index) => (
                        <motion.div
                            key={req.id}
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 25,
                                delay: index * 0.05,
                            }}
                            layout
                            className={`group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 shadow-lg hover:shadow-xl transition-all hover:scale-105 ${req.status === "rejected"
                                    ? "border-2 border-red-500/30"
                                    : req.status === "pending"
                                        ? "border-2 border-brand-amber/30"
                                        : "border border-neutral-800"
                                }`}
                        >
                            {/* Image with conditional filter */}
                            <Image
                                src={req.imageSrc}
                                alt="Proof of Need"
                                fill
                                className={`object-cover transition-all duration-500 ${req.status === "rejected"
                                        ? "grayscale blur-[2px] group-hover:grayscale-0 group-hover:blur-0"
                                        : "blur-[2px] group-hover:blur-0"
                                    } scale-110 group-hover:scale-100`}
                                unoptimized
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                                {/* Status Badge & Timestamp */}
                                <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    {req.status === "approved" && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="bg-brand-green/20 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-brand-green/50"
                                        >
                                            <CheckCircle size={12} className="text-brand-green" />
                                            <span className="text-xs font-bold text-brand-green uppercase tracking-wide">
                                                Verified
                                            </span>
                                        </motion.div>
                                    )}
                                    {req.status === "pending" && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="bg-brand-amber/20 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-brand-amber/50"
                                        >
                                            <AlertTriangle size={12} className="text-brand-amber" />
                                            <span className="text-xs font-bold text-brand-amber uppercase tracking-wide">
                                                Pending
                                            </span>
                                        </motion.div>
                                    )}
                                    {req.status === "rejected" && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="bg-red-500/20 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-red-500/50"
                                        >
                                            <XCircle size={12} className="text-red-500" />
                                            <span className="text-xs font-bold text-red-500 uppercase tracking-wide">
                                                Failed
                                            </span>
                                        </motion.div>
                                    )}

                                    <div className="bg-neutral-800/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-xs text-neutral-400">
                                        <Clock size={12} />
                                        {formatDistanceToNow(req.timestamp, { addSuffix: true })}
                                    </div>
                                </div>

                                {/* Title based on status */}
                                {req.status === "approved" && (
                                    <h3 className="text-white font-bold text-lg leading-tight mb-2">
                                        $50 Relief <br /> <span className="text-brand-green">Provided</span>
                                    </h3>
                                )}
                                {req.status === "pending" && (
                                    <h3 className="text-white font-bold text-lg leading-tight mb-2">
                                        Review <br /> <span className="text-brand-amber">Pending</span>
                                    </h3>
                                )}
                                {req.status === "rejected" && (
                                    <h3 className="text-white font-bold text-lg leading-tight mb-2">
                                        Verification <br /> <span className="text-red-500">Failed</span>
                                    </h3>
                                )}

                                {/* AI Reason - Transparency */}
                                <div className="bg-black/60 backdrop-blur-sm rounded-lg p-2 mb-2 border border-neutral-700/50">
                                    <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">
                                        AI Analysis
                                    </p>
                                    <p className="text-xs text-neutral-300 line-clamp-2 italic">
                                        &quot;{req.reason}&quot;
                                    </p>
                                </div>

                                {/* Trust Score */}
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-neutral-400">
                                        Trust Score: <span className={`font-bold ${req.status === "approved"
                                                ? "text-brand-green"
                                                : req.status === "pending"
                                                    ? "text-brand-amber"
                                                    : "text-red-500"
                                            }`}>{req.score}/100</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
