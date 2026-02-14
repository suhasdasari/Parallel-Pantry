import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { tempoModerato } from "@/lib/tempo-chain";
import { tempoActions } from "viem/tempo";
import { VAULT_ABI, VAULT_ADDRESS, PATH_USD_DECIMALS } from "@/lib/contracts";
import { getQueue, clearQueue, recordClaim } from "@/lib/payout-store";

export async function POST(_req: NextRequest) {
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

        const walletClient = createWalletClient({
            account,
            chain: tempoModerato,
            transport: http(),
        }).extend(tempoActions());

        console.log(`🚀 Processing Parallel Batch: ${queue.length} requests...`);

        // 2. Process in Parallel using 2D Nonces
        const transactions = queue.map(async (payout, index) => {
            // Unique nonceKey (lane) for EVERY transaction to ensure absolute parallelization
            const nonceKey = BigInt(Date.now() + index);

            // Dynamic Payout Amount logic
            const amount = payout.amount || "50";
            const amountWei = parseUnits(amount, PATH_USD_DECIMALS);

            // Construct 32-byte Memo (On-chain Transparency)
            // Format: "AUDIT:[SCORE]:[REASON]"
            // We clip to 31 chars to be safe for 32-byte encoding if needed
            const memoText = `AUDIT:${payout.score}:${payout.reason || "NEEDED"}`.substring(0, 31);

            try {
                // Small staggered delay to avoid 429 Rate Limit from RPC during fast rounds
                if (index > 0) await new Promise(r => setTimeout(r, index * 100));

                console.log(`[Lane ${nonceKey}] Sending $${amount} to ${payout.recipientAddress} (Memo: ${memoText})...`);

                const hash = await walletClient.writeContract({
                    address: VAULT_ADDRESS as `0x${string}`,
                    abi: VAULT_ABI,
                    functionName: "withdraw",
                    args: [payout.recipientAddress as `0x${string}`, amountWei],
                    nonceKey,
                    // Tempo-specific: include on-chain memo
                    memo: memoText,
                } as Parameters<typeof walletClient.writeContract>[0]);

                recordClaim(payout.recipientAddress);
                return { success: true, hash, recipient: payout.recipientAddress, amount, memo: memoText };
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                console.error(`[Lane ${nonceKey}] Failed:`, message);
                return { success: false, error: message, recipient: payout.recipientAddress };
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
            message: `Processed ${successfulCount}/${queue.length} dynamic distributions with on-chain memos.`
        });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Batch payout system error:", message);
        return NextResponse.json({
            error: "Failed to process batch payout",
            details: message
        }, { status: 500 });
    }
}
