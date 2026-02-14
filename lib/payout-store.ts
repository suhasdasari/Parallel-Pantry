import fs from "fs";
import path from "path";

export interface PayoutRequest {
    id: string;
    recipientAddress: string;
    amount: string;
    score: number;
    reason: string;
    timestamp: number;
}

const QUEUE_FILE = path.join(process.cwd(), "payout-queue.json");

export function getQueue(): PayoutRequest[] {
    try {
        if (!fs.existsSync(QUEUE_FILE)) {
            return [];
        }
        const data = fs.readFileSync(QUEUE_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading payout queue:", error);
        return [];
    }
}

export function addToQueue(request: PayoutRequest): void {
    try {
        const queue = getQueue();
        queue.push(request);
        fs.writeFileSync(QUEUE_FILE, JSON.stringify(queue, null, 2));
    } catch (error) {
        console.error("Error writing to payout queue:", error);
    }
}

export function clearQueue(): void {
    try {
        fs.writeFileSync(QUEUE_FILE, JSON.stringify([], null, 2));
    } catch (error) {
        console.error("Error clearing payout queue:", error);
    }
}
