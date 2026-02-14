"use client";

import { useState, useEffect } from "react";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { VAULT_ADDRESS, VAULT_ABI, PATH_USD_ADDRESS, PATH_USD_ABI, PATH_USD_DECIMALS } from "@/lib/contracts";
import { createPublicClient, createWalletClient, custom, http, formatUnits } from "viem";
import { tempoTestnet } from "@/lib/tempo-chain";

export function useVault() {
    const { ready, authenticated } = usePrivy();
    const { wallets } = useWallets();
    const [vaultBalance, setVaultBalance] = useState<string>("0.00");
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

            // Format units using 6 decimals
            setVaultBalance(formatUnits(balance as bigint, PATH_USD_DECIMALS));
        } catch (err) {
            console.error("Error fetching vault balance:", err);
        }
    };

    // Switch to Tempo network
    const switchToTempoNetwork = async (provider: any) => {
        try {
            // Try to switch to Tempo network
            await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: `0x${tempoTestnet.id.toString(16)}` }], // 0xa5dd in hex
            });
            return true;
        } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await provider.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: `0x${tempoTestnet.id.toString(16)}`,
                                chainName: tempoTestnet.name,
                                nativeCurrency: tempoTestnet.nativeCurrency,
                                rpcUrls: [tempoTestnet.rpcUrls.default.http[0]],
                                blockExplorerUrls: [tempoTestnet.blockExplorers.default.url],
                            },
                        ],
                    });
                    return true;
                } catch (addError) {
                    console.error("Error adding Tempo network:", addError);
                    throw new Error("Failed to add Tempo network to wallet");
                }
            }
            throw switchError;
        }
    };

    // Deposit to vault
    const deposit = async (amount: string) => {
        if (!authenticated) {
            setError("Please authenticate first");
            return false;
        }

        if (!wallet) {
            setError("Wallet not ready. Please wait a moment and try again.");
            return false;
        }

        setIsLoading(true);
        setError(null);

        try {
            const provider = await wallet.getEthereumProvider();

            // Check current chain
            const chainId = await provider.request({ method: "eth_chainId" }) as string;
            const currentChainId = parseInt(chainId, 16);

            // If not on Tempo, switch networks
            if (currentChainId !== tempoTestnet.id) {
                console.log(`Switching from chain ${currentChainId} to Tempo (${tempoTestnet.id})`);
                await switchToTempoNetwork(provider);
                // Wait a bit for the network switch to complete
                await new Promise((resolve) => setTimeout(resolve, 1000));
            }

            const accounts = await provider.request({ method: "eth_accounts" }) as string[];

            if (!accounts || accounts.length === 0) {
                setError("No wallet address found. Please reconnect.");
                setIsLoading(false);
                return false;
            }

            const address = accounts[0];

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
