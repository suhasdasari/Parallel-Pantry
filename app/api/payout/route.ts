import { NextRequest, NextResponse } from "next/server";
import { addToQueue, getUserClaimCount, getQueue } from "@/lib/payout-store";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { recipientAddress, score, reason, payoutAmount } = body;

        // 1. Validation
        if (!recipientAddress || !score) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. Claim Limit Check
        const maxClaims = process.env.MAX_CLAIMS_PER_USER || "unlimited";
        if (maxClaims !== "unlimited") {
            const currentClaims = getUserClaimCount(recipientAddress);
            const limit = parseInt(maxClaims);

            // Also check if they already have one in the queue
            const queue = getQueue();
            const alreadyInQueue = queue.some(q => q.recipientAddress.toLowerCase() === recipientAddress.toLowerCase());

            if (currentClaims >= limit || alreadyInQueue) {
                return NextResponse.json({
                    error: "Claim limit reached",
                    details: `You have already claimed your maximum entitlement (${limit} relief grants).`
                }, { status: 403 });
            }
        }

        // 3. AI Threshold Check (Dynamic)
        // Now supporting 60+ for smaller $25 grants
        if (score < 60) {
            return NextResponse.json({
                error: "Score too low for automatic payout",
                details: "AI Auditor requires a score of 60+ for instant relief."
            }, { status: 403 });
        }

        // 4. Queue the Payout
        const finalAmount = payoutAmount || 50; // Fallback to 50 if missing

        const payoutRequest = {
            id: Date.now().toString(),
            recipientAddress,
            amount: finalAmount.toString(),
            score,
            reason,
            timestamp: Date.now()
        };

        addToQueue(payoutRequest);

        console.log(`Queued payout of ${finalAmount} PathUSD for ${recipientAddress} (Score: ${score})`);

        return NextResponse.json({
            success: true,
            status: "queued",
            message: "Relief request verified and queued for the next Relief Round."
        });

    } catch (error: any) {
        console.error("Payout queuing error:", error);
        return NextResponse.json({
            error: "Failed to queue payout",
            details: error.message
        }, { status: 500 });
    }
}
