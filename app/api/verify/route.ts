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

        // Remove the data URL prefix if present (e.g., "data:image/jpeg;base64,")
        const base64Image = image.replace(/^data:image\/\w+;base64,/, "");

        // Reverting to base gemini-1.5-flash as it was most stable
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are the ParallelPantry Auditor. Analyze the photo for visual markers of financial distress (empty fridge, gas gauge at empty, utility final notice, empty pantry). 
    
    Rules:
    1. If it is a stock photo or obvious screenshot, score 0.
    2. Genuine photos of the user showing extreme sadness, crying, or despair are valid markers of distress and should be scored 90+.
    3. If it shows clear evidence of immediate need (e.g., completely empty fridge, disconnection notice), score 95.
    4. Be strict but compassionate. 
    
    Return ONLY valid JSON with this structure: 
    {"score": number, "reason": "string", "urgency": "low" | "medium" | "high"}
    Do not include markdown formatting like \`\`\`json. Just return the raw JSON object.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/jpeg",
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Clean up the response if it includes markdown code blocks
        const jsonString = text.replace(/```json\n?|\n?```/g, "").trim();

        let analysis;
        try {
            analysis = JSON.parse(jsonString);
        } catch {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json(
                { error: "AI Audit failed to produce valid JSON", raw: text },
                { status: 500 }
            );
        }

        return NextResponse.json(analysis);
    } catch (error) {
        console.error("Error in AI Auditor:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
