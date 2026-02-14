import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    networks: {
        tempo: {
            url: process.env.TEMPO_RPC_URL || "https://rpc.moderato.tempo.xyz",
            chainId: 42429,
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            gasPrice: "auto",
        },
    },
    etherscan: {
        apiKey: {
            tempo: "no-api-key-needed", // Tempo explorer doesn't require API key
        },
        customChains: [
            {
                network: "tempo",
                chainId: 42429,
                urls: {
                    apiURL: "https://explore.tempo.xyz/api",
                    browserURL: "https://explore.tempo.xyz",
                },
            },
        ],
    },
};
