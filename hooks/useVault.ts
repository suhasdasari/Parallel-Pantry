"use client";

import { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { VAULT_ADDRESS, VAULT_ABI, PATH_USD_ADDRESS, PATH_USD_ABI } from "@/lib/contracts";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { tempoTestnet } from "@/lib/tempo-chain";

export function useVault() {
    const { ready, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const [vaultBalance, setVaultBalance] = useState<string>("0");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const wallet = wallets[0]; // Get the first wallet (embedded wallet from Privy)

    // Fetch vault balance
    const fetchVaultBalance = async () => {
        if (!wallet) return;

        try {
            const provider = await wallet.getEthereumProvider();

            const publicClient = createPublicClient({
                chain: tempoTestnet,
                transport: custom(provider),
            });

            const balance = await publicClient.readContract({
                address: VAULT_ADDRESS as `0x${string}`,
                abi: VAULT_ABI,
                functionName: "getBalance",
            });

            setVaultBalance(balance.toString());
        } catch (err) {
            console.error("Error fetching vault balance:", err);
        }
    };

    // Deposit to vault
    const deposit = async (amount: string) => {
        if (!wallet || !authenticated) {
            setError("Please connect your wallet first");
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const provider = await wallet.getEthereumProvider();
            const [address] = await provider.request({ method: "eth_accounts" });

            const walletClient = createWalletClient({
                account: address as `0x${string}`,
                chain: tempoTestnet,
                transport: custom(provider),
            });

            // First, approve pathUSD spending
            console.log("Approving pathUSD spending...");
            const approveHash = await walletClient.writeContract({
                address: PATH_USD_ADDRESS as `0x${string}`,
                abi: PATH_USD_ABI,
                functionName: "approve",
                args: [VAULT_ADDRESS, BigInt(amount)],
            });

            console.log("Approve tx:", approveHash);

            // Wait for approval
            await new Promise((resolve) => setTimeout(resolve, 3000));

            // Then deposit to vault
            console.log("Depositing to vault...");
            const depositHash = await walletClient.writeContract({
                address: VAULT_ADDRESS as `0x${string}`,
                abi: VAULT_ABI,
                functionName: "deposit",
                args: [BigInt(amount)],
            });

            console.log("Deposit tx:", depositHash);

            // Refresh balance
            await new Promise((resolve) => setTimeout(resolve, 3000));
            await fetchVaultBalance();

            setIsLoading(false);
            return true;
        } catch (err: any) {
            console.error("Deposit error:", err);
            setError(err.message || "Failed to deposit");
            setIsLoading(false);
            return false;
        }
    };

    // Fetch balance on mount and when wallet changes
    useEffect(() => {
        if (ready && authenticated && wallet) {
            fetchVaultBalance();
        }
    }, [ready, authenticated, wallet]);

    return {
        vaultBalance,
        deposit,
        isLoading,
        error,
        refreshBalance: fetchVaultBalance,
    };
}
