import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { tempoModerato } from "@/lib/tempo-chain";
import { tempoActions } from "viem/tempo";
import { VAULT_ABI, VAULT_ADDRESS, PATH_USD_DECIMALS } from "@/lib/contracts";
import { getQueue, clearQueue, recordClaim } from "@/lib/payout-store";

export async function POST(req: NextRequest) {
    try {
        const queue = getQueue();

        if (queue.length === 0) {
            return NextResponse.json({
                success: true,
                message: "No pending payouts in queue."
            });
        }

        // 1. AI Agent Configuration
        const privateKey = process.env.AI_AGENT_PRIVATE_KEY;
        if (!privateKey) {
            return NextResponse.json({ error: "Server payout configuration missing" }, { status: 500 });
        }

        const account = privateKeyToAccount(privateKey as `0x${string}`);

        const publicClient = createPublicClient({
            chain: tempoModerato,
            transport: http(),
        });

        // Extend with Tempo actions for 2D Nonce support
        const walletClient = createWalletClient({
            account,
            chain: tempoModerato,
            transport: http(),
        }).extend(tempoActions());

        console.log(`Processing Batch Payout of ${queue.length} requests using 2D nonces...`);

        // 2. Process in Parallel using 2D Nonces (Lanes 1 to N)
        const payoutAmount = parseUnits("50", PATH_USD_DECIMALS);

        const transactions = queue.map(async (payout, index) => {
            // Assign a unique nonceKey (lane) for each transaction (1-based)
            const nonceKey = BigInt(index + 1);

            console.log(`[Lane ${nonceKey}] Sending $50 to ${payout.recipientAddress}...`);

            try {
                const hash = await walletClient.writeContract({
                    address: VAULT_ADDRESS as `0x${string}`,
                    abi: VAULT_ABI,
                    functionName: "withdraw",
                    args: [payout.recipientAddress as `0x${string}`, payoutAmount],
                    nonceKey, // Multi-Dimensional Nonce (Parallel Execution)
                } as any);

                // Record the claim for this user
                recordClaim(payout.recipientAddress);

                return { success: true, hash, recipient: payout.recipientAddress, lane: index + 1 };
            } catch (err: any) {
                console.error(`[Lane ${nonceKey}] Failed payout to ${payout.recipientAddress}:`, err.message);
                return { success: false, error: err.message, recipient: payout.recipientAddress, lane: index + 1 };
            }
        });

        const results = await Promise.all(transactions);

        // 3. Clear Queue
        clearQueue();

        const successfulCount = results.filter(r => r.success).length;

        return NextResponse.json({
            success: true,
            totalProcessed: queue.length,
            successful: successfulCount,
            results,
            message: `Processed ${successfulCount}/${queue.length} relief distributions in parallel lanes.`
        });

    } catch (error: any) {
        console.error("Batch payout system error:", error);
        return NextResponse.json({
            error: "Failed to process batch payout",
            details: error.message
        }, { status: 500 });
    }
}
