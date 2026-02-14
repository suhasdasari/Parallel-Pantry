import { NextRequest, NextResponse } from "next/server";
import { createPublicClient, createWalletClient, http, parseUnits } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { tempoModerato } from "@/lib/tempo-chain";
import { VAULT_ABI, VAULT_ADDRESS, PATH_USD_DECIMALS } from "@/lib/contracts";

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

        // 3. AI Agent Configuration
        const privateKey = process.env.AI_AGENT_PRIVATE_KEY;
        if (!privateKey) {
            console.error("Missing AI_AGENT_PRIVATE_KEY environment variable");
            return NextResponse.json({ error: "Server payout configuration missing" }, { status: 500 });
        }

        const account = privateKeyToAccount(privateKey as `0x${string}`);

        const publicClient = createPublicClient({
            chain: tempoModerato,
            transport: http(),
        });

        const walletClient = createWalletClient({
            account,
            chain: tempoModerato,
            transport: http(),
        });

        // 4. Execute Payout ($50 PathUSD)
        const payoutAmount = parseUnits("50", PATH_USD_DECIMALS);

        console.log(`Executing payout of 50 PathUSD to ${recipientAddress} (Score: ${score})...`);

        const hash = await walletClient.writeContract({
            address: VAULT_ADDRESS as `0x${string}`,
            abi: VAULT_ABI,
            functionName: "withdraw",
            args: [recipientAddress as `0x${string}`, payoutAmount],
        });

        console.log("Payout transaction hash:", hash);

        return NextResponse.json({
            success: true,
            transactionHash: hash,
            amount: 50,
            recipient: recipientAddress,
            message: "Relief funds distributed successfully via Tempo L1."
        });

    } catch (error: any) {
        console.error("Payout system error:", error);
        return NextResponse.json({
            error: "Failed to process payout",
            details: error.message
        }, { status: 500 });
    }
}
