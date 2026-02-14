import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            console.error("Missing GEMINI_API_KEY environment variable");
            return NextResponse.json(
                { error: "Server configuration error" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const body = await req.json();
        const { image } = body;

        if (!image) {
            return NextResponse.json({ error: "Image is required" }, { status: 400 });
        }

        // Clean base64: Remove data URL prefix if present
        const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

        // --- Robust Model Fallback ---
        // Trying multiple versions to avoid the persistent 404 and region-lock issues
        const modelsToTry = [
            "gemini-1.5-flash",
            "gemini-1.5-flash-8b",
            "gemini-1.5-flash-latest"
        ];

        let result = null;
        let lastError = null;

        for (const modelName of modelsToTry) {
            try {
                console.log(`[AI Auditor] Trying model: ${modelName}...`);
                const model = genAI.getGenerativeModel({ model: modelName });

                const prompt = `You are the ParallelPantry Auditor. Analyze the photo for visual markers of financial distress (empty fridge, gas gauge at empty, utility final notice, empty pantry). 
    
    Dynamic Payout Rules:
    1. Score 0-100 based on distress evidence.
    2. Suggest a "payoutAmount" based on score:
       - Score 90+: $100 (Immediate extreme need/Essential notice)
       - Score 75-89: $50 (Significant pantry emptiness/despair)
       - Score 60-74: $25 (Low supplies/sadness)
       - Score < 60: $0 (Insufficient evidence/Screenshot/Stock photo)
    
    Return ONLY valid JSON with this structure: 
    {"score": number, "reason": "string", "urgency": "low" | "medium" | "high", "payoutAmount": number}
    Do not include markdown formatting like \`\`\`json. Just return the raw JSON object.`;

                result = await model.generateContent([
                    prompt,
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: "image/jpeg",
                        },
                    },
                ]);

                if (result) break; // Success!
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : String(err);
                console.warn(`[AI Auditor] ${modelName} failed: ${message}`);
                lastError = err instanceof Error ? err : new Error(message);
            }
        }

        if (!result) {
            throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
        }

        const response = await result.response;
        const text = response.text();

        // Clean up the response if it includes markdown code blocks
        const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();

        let analysis;
        try {
            analysis = JSON.parse(jsonString);

            // Ensure payoutAmount is present and numeric
            if (typeof analysis.payoutAmount !== 'number') {
                analysis.payoutAmount = analysis.score >= 60 ? 50 : 0;
            }

        } catch {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json(
                { error: "AI Audit failed to produce valid JSON", raw: text },
                { status: 500 }
            );
        }

        return NextResponse.json(analysis);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error in AI Auditor:", message);
        return NextResponse.json(
            { error: message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
