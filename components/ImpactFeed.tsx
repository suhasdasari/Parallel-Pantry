"use client";

import React from "react";
import Image from "next/image";
import { CheckCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export interface ImpactRequest {
    id: string;
    imageSrc: string;
    timestamp: Date;
    verified: boolean;
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl mx-auto px-6 py-12">
            {requests.map((req) => (
                <div key={req.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 shadow-lg hover:shadow-xl transition-all hover:scale-105">
                    <Image
                        src={req.imageSrc}
                        alt="Proof of Need"
                        fill
                        className="object-cover blur-[2px] group-hover:blur-0 transition-all duration-500 scale-110 group-hover:scale-100"
                        unoptimized // Allow base64 images without external optimization service
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-brand-green/20 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 border border-brand-green/30">
                                <CheckCircle size={12} className="text-brand-green" />
                                <span className="text-xs font-bold text-brand-green uppercase tracking-wide">AI Verified</span>
                            </div>
                            <div className="bg-neutral-800/80 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-xs text-neutral-400">
                                <Clock size={12} />
                                {formatDistanceToNow(req.timestamp, { addSuffix: true })}
                            </div>
                        </div>

                        <h3 className="text-white font-bold text-lg leading-tight">
                            $50 Relief <br /> <span className="text-brand-green">Provided</span>
                        </h3>
                    </div>
                </div>
            ))}
        </div>
    );
}
