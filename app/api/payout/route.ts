import { NextRequest, NextResponse } from "next/server";
import { addToQueue } from "@/lib/payout-store";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { recipientAddress, score, reason } = body;

        // 1. Validation
        if (!recipientAddress || !score) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 2. AI Threshold Check (Strict)
        if (score < 85) {
            return NextResponse.json({
                error: "Score too low for automatic payout",
                details: "AI Auditor requires a score of 85+ for instant relief."
            }, { status: 403 });
        }

        // 3. Queue the Payout
        const payoutRequest = {
            id: Date.now().toString(),
            recipientAddress,
            amount: "50",
            score,
            reason,
            timestamp: Date.now()
        };

        addToQueue(payoutRequest);

        console.log(`Queued payout of 50 PathUSD for ${recipientAddress} (Score: ${score})`);

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
