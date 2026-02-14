"use client";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import { createPublicClient, http, formatUnits } from "viem";
import { PATH_USD_ABI, PATH_USD_ADDRESS, PATH_USD_DECIMALS } from "@/lib/contracts";
import { tempoModerato } from "@/lib/tempo-chain";
import { LogOut, Wallet } from "lucide-react";
import Link from "next/link";

export default function Header() {
    const { logout, authenticated, user } = usePrivy();
    const { wallets } = useWallets();
    const [balance, setBalance] = useState<string>("0.00");
    const [truncatedAddress, setTruncatedAddress] = useState<string>("");

    const wallet = wallets[0]; // Get the primary wallet

    useEffect(() => {
        if (authenticated && wallet) {
            setTruncatedAddress(
                `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
            );
            fetchBalance(wallet.address);
        } else {
            setBalance("0.00");
            setTruncatedAddress("");
        }
    }, [authenticated, wallet]);

    const fetchBalance = async (address: string) => {
        try {
            const publicClient = createPublicClient({
                chain: tempoModerato,
                transport: http(),
            });

            const balanceResult = await publicClient.readContract({
                address: PATH_USD_ADDRESS,
                abi: PATH_USD_ABI,
                functionName: "balanceOf",
                args: [address as `0x${string}`],
            });

            setBalance(formatUnits(balanceResult as bigint, PATH_USD_DECIMALS));
        } catch (error) {
            console.error("Failed to fetch wallet balance:", error);
        }
    };

    if (!authenticated) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between bg-neutral-900/80 backdrop-blur-md border border-neutral-800 rounded-2xl px-6 py-3 shadow-xl">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <span className="text-black font-black text-xl">P</span>
                    </div>
                    <span className="font-bold text-lg hidden sm:block">Parallel Pantry</span>
                </Link>

                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Your Balance</span>
                        <span className="text-brand-green font-mono font-bold">{balance} pathUSD</span>
                    </div>

                    <div className="h-8 w-[1px] bg-neutral-800 hidden md:block" />

                    <div className="flex items-center gap-3 bg-neutral-800/50 rounded-xl px-4 py-2 border border-neutral-700">
                        <Wallet className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm font-mono text-neutral-200">{truncatedAddress}</span>
                    </div>

                    <button
                        onClick={() => logout()}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-red-400 transition-all border border-neutral-700"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
