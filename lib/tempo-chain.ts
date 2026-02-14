import { defineChain } from "viem";

export const tempoTestnet = defineChain({
    id: 42431,
    name: "Tempo Testnet (Moderato)",
    nativeCurrency: {
        decimals: 18,
        name: "USD",
        symbol: "USD",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.moderato.tempo.xyz"],
            webSocket: ["wss://rpc.moderato.tempo.xyz"],
        },
    },
    blockExplorers: {
        default: { name: "Tempo Explorer", url: "https://explore.tempo.xyz" },
    },
    testnet: true,
});
