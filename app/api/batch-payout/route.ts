import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { tempoModerato } from "@/lib/tempo-chain";
import { tempoActions } from "viem/tempo";
import { VAULT_ABI, VAULT_ADDRESS, PATH_USD_DECIMALS } from "@/lib/contracts";
import { popQueue, recordClaim, isLocked, setLock } from "@/lib/payout-store";

export async function POST(req: NextRequest) {
    // 1. Check Lock (Simple concurrency protection)
    if (isLocked()) {
        console.log("Batch payout already in progress, skipping...");
        return NextResponse.json({ success: true, message: "Sync in progress" });
    }

    try {
        setLock(true);

        // Atomic pop: get items and clear file immediately
        const queue = popQueue();

        if (queue.length === 0) {
            setLock(false);
            return NextResponse.json({
                success: true,
                message: "No pending payouts in queue."
            });
        }

        // 2. AI Agent Configuration
        const privateKey = process.env.AI_AGENT_PRIVATE_KEY;
        if (!privateKey) {
            setLock(false);
            return NextResponse.json({ error: "Server payout configuration missing" }, { status: 500 });
        }

        const account = privateKeyToAccount(privateKey as `0x${string}`);

        const walletClient = createWalletClient({
            account,
            chain: tempoModerato,
            transport: http(),
        }).extend(tempoActions());

        console.log(`🚀 Processing Parallel Batch: ${queue.length} requests...`);

        // 3. Process in Parallel using 2D Nonces
        const payoutAmount = parseUnits("50", PATH_USD_DECIMALS);
        const startTime = Date.now();

        const transactions = queue.map(async (payout, index) => {
            // Highly unique nonceKey (lane) for EVERY transaction
            // Multiplying by 1000 + index ensures lanes never collide across batches
            const nonceKey = BigInt((startTime % 1000000) * 100 + index);

            console.log(`[Lane ${nonceKey}] Sending relief to ${payout.recipientAddress}...`);

            try {
                const hash = await walletClient.writeContract({
                    address: VAULT_ADDRESS as `0x${string}`,
                    abi: VAULT_ABI,
                    functionName: "withdraw",
                    args: [payout.recipientAddress as `0x${string}`, payoutAmount],
                    nonceKey,
                } as any);

                recordClaim(payout.recipientAddress);
                return { success: true, hash, recipient: payout.recipientAddress };
            } catch (err: any) {
                console.error(`❌ Lane ${nonceKey} Failed:`, err.message);
                return { success: false, error: err.message, recipient: payout.recipientAddress };
            }
        });

        const results = await Promise.all(transactions);
        const successfulCount = results.filter(r => r.success).length;

        console.log(`✅ Batch Complete: ${successfulCount}/${queue.length} successful distributions.`);

        return NextResponse.json({
            success: true,
            totalProcessed: queue.length,
            successful: successfulCount,
            results,
            message: `Processed ${successfulCount}/${queue.length} distributions in parallel lanes.`
        });

    } catch (error: any) {
        console.error("Batch payout system error:", error);
        return NextResponse.json({
            error: "Failed to process batch payout",
            details: error.message
        }, { status: 500 });
    } finally {
        setLock(false);
    }
}
