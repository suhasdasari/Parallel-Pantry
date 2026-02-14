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
const CLAIMS_FILE = path.join(process.cwd(), "payout-claims.json");

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

export function getClaims(): Record<string, number> {
    try {
        if (!fs.existsSync(CLAIMS_FILE)) {
            return {};
        }
        const data = fs.readFileSync(CLAIMS_FILE, "utf8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading payout claims:", error);
        return {};
    }
}

export function recordClaim(address: string): void {
    try {
        const claims = getClaims();
        claims[address.toLowerCase()] = (claims[address.toLowerCase()] || 0) + 1;
        fs.writeFileSync(CLAIMS_FILE, JSON.stringify(claims, null, 2));
    } catch (error) {
        console.error("Error recording payout claim:", error);
    }
}

export function getUserClaimCount(address: string): number {
    const claims = getClaims();
    return claims[address.toLowerCase()] || 0;
}
