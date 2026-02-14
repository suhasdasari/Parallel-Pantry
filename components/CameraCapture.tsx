"use client";

import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { RefreshCw, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

interface CameraCaptureProps {
    onCapture: (imageSrc: string) => void;
    isLoading: boolean;
}

const videoConstraints = {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    facingMode: "environment",
};

export default function CameraCapture({ onCapture, isLoading }: CameraCaptureProps) {
    const webcamRef = useRef<Webcam>(null);
    const [image, setImage] = useState<string | null>(null);

    const capture = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setImage(imageSrc);
                onCapture(imageSrc);
            }
        }
    }, [webcamRef, onCapture]);

    const retake = () => {
        setImage(null);
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-4">
            <div className="relative w-full aspect-[3/4] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-neutral-800">
                {!image ? (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="absolute inset-0 w-full h-full object-cover"
                            mirrored={false}
                        />
                        {/* Viewfinder Overlay */}
                        <div className="absolute inset-0 border-2 border-brand-green/30 m-8 rounded-xl pointer-events-none">
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-green -mt-1 -ml-1 rounded-tl-lg"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-green -mt-1 -mr-1 rounded-tr-lg"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-green -mb-1 -ml-1 rounded-bl-lg"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-green -mb-1 -mr-1 rounded-br-lg"></div>
                        </div>

                        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                            <button
                                onClick={capture}
                                disabled={isLoading}
                                className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/40 transition-all active:scale-95"
                                aria-label="Capture photo"
                            >
                                <div className="w-16 h-16 bg-white rounded-full"></div>
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <img src={image} alt="Captured proof" className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                            <button
                                onClick={retake}
                                disabled={isLoading}
                                className="px-6 py-3 bg-neutral-900/80 backdrop-blur text-white rounded-full flex items-center gap-2 hover:bg-neutral-800 transition-colors border border-neutral-700"
                            >
                                <RefreshCw size={18} />
                                Retake
                            </button>
                        </div>

                        {isLoading && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-6 text-center">
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="w-16 h-16 border-4 border-brand-green border-t-transparent rounded-full mb-4"
                                />
                                <h3 className="text-xl font-bold mb-2">AI Auditor Analyzing...</h3>
                                <p className="text-gray-300 text-sm">Verifying proof of need for instant relief.</p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {!image && (
                <p className="text-sm text-neutral-500 flex items-center gap-2">
                    <Smartphone size={16} />
                    Position the evidence clearly in the frame
                </p>
            )}
        </div>
    );
}
