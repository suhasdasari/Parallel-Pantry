"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { HelpingHand, Sprout } from "lucide-react";
import { useRouter } from "next/navigation";
import RequestModal from "@/components/RequestModal";
import ImpactFeed, { ImpactRequest } from "@/components/ImpactFeed";

export default function Home() {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [requests, setRequests] = useState<ImpactRequest[]>([]);
  const router = useRouter();

  const handlePayoutSuccess = ({ image }: { image: string; email: string }) => {
    // Add new successful request to the feed
    const newRequest: ImpactRequest = {
      id: Date.now().toString(),
      imageSrc: image,
      timestamp: new Date(),
      verified: true,
    };

    setRequests((prev) => [newRequest, ...prev]);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
      },
    },
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-6 bg-background text-foreground overflow-x-hidden relative">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none fixed">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-brand-green/20 blur-[120px] rounded-full" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-brand-amber/10 blur-[100px] rounded-full" />
      </div>

      <motion.div
        variants={containerVariants}
        // initial="hidden" 
        animate="visible"
        className="z-10 w-full max-w-6xl flex flex-col items-center gap-16 py-12"
      >
        <motion.div variants={itemVariants} className="text-center space-y-4 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-transparent">
            Parallel Pantry
          </h1>
          <p className="text-xl md:text-2xl text-neutral-400 font-light max-w-2xl mx-auto">
            Decentralized, AI-verified community treasury providing instant relief.
          </p>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid md:grid-cols-2 gap-6 w-full max-w-4xl"
        >
          {/* Support Button */}
          <button
            onClick={() => router.push("/donate")}
            className="group relative flex flex-col items-center justify-center gap-6 p-12 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-brand-green/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.3)] text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="p-6 rounded-full bg-neutral-800 group-hover:bg-brand-green/10 group-hover:scale-110 transition-all duration-300">
              <Sprout className="w-12 h-12 text-neutral-400 group-hover:text-brand-green transition-colors" />
            </div>
            <div className="space-y-2 z-10">
              <h2 className="text-3xl font-bold group-hover:text-brand-green transition-colors">
                Support the Pool
              </h2>
              <p className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
                Donate pathUSD to the treasury and help your community.
              </p>
            </div>
          </button>

          {/* Request Relief Button */}
          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="group relative flex flex-col items-center justify-center gap-6 p-12 rounded-3xl bg-neutral-900 border border-neutral-800 hover:border-brand-amber/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(245,158,11,0.3)] text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />
            <div className="p-6 rounded-full bg-neutral-800 group-hover:bg-brand-amber/10 group-hover:scale-110 transition-all duration-300">
              <HelpingHand className="w-12 h-12 text-neutral-400 group-hover:text-brand-amber transition-colors" />
            </div>
            <div className="space-y-2 z-10">
              <h2 className="text-3xl font-bold group-hover:text-brand-amber transition-colors">
                Request Relief
              </h2>
              <p className="text-neutral-400 group-hover:text-neutral-300 transition-colors">
                Instant $50 relief for food, gas, and bills. Verified by AI.
              </p>
            </div>
          </button>
        </motion.div>

        {/* Impact Feed Section */}
        <motion.div variants={itemVariants} className="w-full space-y-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-2">Live Impact Feed</h3>
            <div className="h-1 w-20 bg-brand-green mx-auto rounded-full" />
          </div>
          <ImpactFeed requests={requests} />
        </motion.div>

      </motion.div>

      <RequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onSuccess={handlePayoutSuccess}
      />
    </main>
  );
}
