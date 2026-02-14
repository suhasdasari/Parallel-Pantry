# Parallel Pantry: High-Velocity AI Relief Round

**ParallelPantry** is a high-throughput, AI-powered micro-relief engine built on the **Tempo Network**. It converts the "slow and sequential" charity of today into a parallel financial rail for immediate crisis management (hunger, transport, essentials).

## 🚀 Hackathon "Wow" Features
- **AI Auditor "Race Mode"**: Achieves **sub-3-second verification** by firing concurrent requests to multiple Gemini models (`flash`, `flash-8b`, `latest`) simultaneously. The fastest successful result wins, eliminating sequential lag.
- **High-Throughput Parallel Settlement**: Utilizes **Tempo 2D Nonces** to process multiple relief distributions concurrently, bypassing the standard blockchain bottleneck of sequential transactions.
- **Direct On-Chain Transparency**: Every relief grant carries a **32-byte Audit Memo** (e.g., `AUDIT:95:FOOD_DEPLETION`) directly on the Tempo blockchain, providing a decentralized, immutable audit trail for donors.
- **Dynamic Grant Scaling**: The AI Auditor intelligently recommends grant sizes (**$25, $50, or $100**) based on real-time urgency and distress analysis of the user's proof.
- **Zero-Friction UX**: Integrated with **Privy Biometric Passkeys** for seamless onboarding and **Tempo Fee Sponsorship** to ensure victims receive 100% of the funds with zero gas requirements.

## 🛠️ Project Stack
- **Auth/Identity**: [Privy](https://www.privy.io/) (Biometric Passkeys)
- **AI Engine**: [Google Gemini 1.5](https://deepmind.google/technologies/gemini/) (Multimodal Audit)
- **Settlement Layer**: [Tempo Network](https://tempo.xyz/) (2D Nonces & Parallel Execution)
- **Framework**: Next.js 14, Tailwind CSS, Viem

## 📦 Deployment Info

- **Vault Contract:** `0x0b3012EdaA34872d536CeE2f80D4BfFD6e854B6A` (Deployed on Tempo Moderato)
- **Currency:** pathUSD (6 Decimals) - `0x20C0000000000000000000000000000000000000`
- **Chain ID:** 42431

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Setup:**
   - Copy `.env.example` to `.env`
   - Set `GEMINI_API_KEY` for the Auditor Race Engine.
   - Set `AI_AGENT_PRIVATE_KEY` for the Autonomous Payout Agent.

3. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🏁 Team
- **Suhas Dasari**: High-Throughput Infrastructure, L1 Parallelism, Identity
- **Susmitha Gurram**: AI Audit Engineering, Real-time Verification, Frontend UX
