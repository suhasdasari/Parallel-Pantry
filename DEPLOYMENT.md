# Vault Smart Contract Deployment Guide

## Overview

This guide explains how to deploy the ParallelPantryVault smart contract to Tempo L1 testnet.

## Prerequisites

1. **Wallet with testnet pathUSD**
   - Get testnet pathUSD from Tempo faucet
   - Ensure you have enough for gas fees

2. **Private Key**
   - Export your wallet's private key
   - Never commit this to git!

## Setup

### 1. Install Dependencies

First, fix npm permissions if needed:
```bash
sudo chown -R 501:20 "/Users/suhasdasari/.npm"
```

Then install Hardhat:
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox @openzeppelin/contracts
```

### 2. Configure Environment

Add your private key to `.env`:
```bash
TEMPO_RPC_URL=https://rpc.moderato.tempo.xyz
PRIVATE_KEY=your_private_key_here_without_0x_prefix
```

**⚠️ IMPORTANT:** Never commit `.env` to git!

## Deployment

### Deploy to Tempo Testnet

```bash
npx hardhat run scripts/deploy.js --network tempo
```

This will:
1. Deploy the vault contract
2. Set pathUSD token address (`0x20c0000000000000000000000000000000000000`)
3. Set AI agent address (initially the deployer)
4. Save deployment info to `deployment-info.json`

### Verify Contract (Optional)

After deployment:
```bash
npx hardhat verify --network tempo <VAULT_ADDRESS> 0x20c0000000000000000000000000000000000000 <AI_AGENT_ADDRESS>
```

## Contract Details

### ParallelPantryVault

**Key Functions:**
- `deposit(uint256 amount)` - Donors deposit pathUSD
- `withdraw(address recipient, uint256 amount)` - AI agent withdraws to verified recipients
- `getBalance()` - Get current vault balance
- `updateAIAgent(address newAgent)` - Owner updates AI agent address

**Events:**
- `Deposited(address donor, uint256 amount, uint256 timestamp)`
- `Withdrawn(address recipient, uint256 amount, address aiAgent, uint256 timestamp)`
- `AIAgentUpdated(address oldAgent, address newAgent)`

## Post-Deployment

1. **Save the vault address** from `deployment-info.json`
2. **Update frontend** with the vault address in `lib/contracts.ts`
3. **Test deposit** function manually
4. **Update AI agent** address when ready (using `updateAIAgent()`)

## Network Info

- **Network:** Tempo L1 Testnet (Moderato)
- **Chain ID:** 42429
- **RPC:** https://rpc.moderato.tempo.xyz
- **Explorer:** https://explore.tempo.xyz
- **pathUSD:** 0x20c0000000000000000000000000000000000000
