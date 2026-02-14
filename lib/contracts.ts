// Contract addresses and configuration for Tempo network
export const TEMPO_NETWORK = {
    chainId: 42431,
    name: "Tempo Testnet (Moderato)",
    rpcUrl: "https://rpc.moderato.tempo.xyz",
    blockExplorer: "https://explore.tempo.xyz",
} as const;

// pathUSD token (predeployed on Tempo)
export const PATH_USD_ADDRESS = "0x20C0000000000000000000000000000000000000";
export const PATH_USD_DECIMALS = 6;

// Vault contract address
export const VAULT_ADDRESS = "0x0b3012EdaA34872d536CeE2f80D4BfFD6e854B6A";

// Vault ABI (only the functions we need for the frontend)
export const VAULT_ABI = [
    {
        inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
        name: "deposit",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getBalance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getStats",
        outputs: [
            { internalType: "uint256", name: "balance", type: "uint256" },
            { internalType: "uint256", name: "deposited", type: "uint256" },
            { internalType: "uint256", name: "withdrawn", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "donor", type: "address" }],
        name: "getDonorContribution",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "recipient", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "withdraw",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        anonymous: false,
        inputs: [
            { indexed: true, internalType: "address", name: "donor", type: "address" },
            { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
            { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
        ],
        name: "Deposited",
        type: "event",
    },
] as const;

// pathUSD token ABI (ERC20 functions we need)
export const PATH_USD_ABI = [
    {
        inputs: [
            { internalType: "address", name: "spender", type: "address" },
            { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            { internalType: "address", name: "owner", type: "address" },
            { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
    },
] as const;
