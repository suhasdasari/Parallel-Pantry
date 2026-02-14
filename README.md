# Parallel Pantry: High-Velocity AI Relief Round

**ParallelPantry** is a high-throughput, AI-powered micro-relief engine built on the **Tempo Network**. It converts the "slow and sequential" charity of today into a parallel financial rail for immediate crisis management (hunger, transport, essentials).

## 🚀 Live Links
- **Hosted App**: [parallel-pantry.vercel.app](https://parallel-pantry.vercel.app/)
- **Vault Contract**: [explore.tempo.xyz/address/0x0b3012EdaA34872d536CeE2f80D4BfFD6e854B6A](https://explore.tempo.xyz/address/0x0b3012EdaA34872d536CeE2f80D4BfFD6e854B6A)

## 🚀 Hackathon "Wow" Features
- **AI Auditor "Race Mode"**: Achieves **sub-3-second verification** by firing concurrent requests to multiple Gemini models simultaneously.
  - 📂 **Code:** [app/api/verify/route.ts](https://github.com/suhasdasari/Parallel-Pantry/blob/main/app/api/verify/route.ts)
- **High-Throughput Parallel Settlement**: Utilizes **Tempo 2D Nonces** to process multiple relief distributions concurrently.
  - 📂 **Code:** [app/api/batch-payout/route.ts](https://github.com/suhasdasari/Parallel-Pantry/blob/main/app/api/batch-payout/route.ts)
- **Direct On-Chain Transparency**: Ships a **32-byte Audit Memo** (e.g., `AUDIT:95:FOOD_DEPLETION`) directly to the Tempo blockchain.
  - 📂 **Code:** [Line 62 in batch-payout/route.ts](https://github.com/suhasdasari/Parallel-Pantry/blob/main/app/api/batch-payout/route.ts#L62)
- **Dynamic Grant Scaling**: AI Auditor suggests grant sizes (**$25, $50, or $100**) based on distress urgency.
  - 📂 **Code:** [verify/route.ts (Prompts)](https://github.com/suhasdasari/Parallel-Pantry/blob/main/app/api/verify/route.ts#L36-L48)
- **Zero-Friction UX**: Biometric onboarding with **Privy Passkeys** and gasless settlement via **Tempo Fee Sponsorship**.
  - 📂 **Code:** [components/RequestModal.tsx](https://github.com/suhasdasari/Parallel-Pantry/blob/main/components/RequestModal.tsx)

## 🛠️ Project Stack
- **Auth/Identity**: [Privy](https://www.privy.io/) (Biometric Passkeys)
- **AI Engine**: [Google Gemini 1.5](https://deepmind.google/technologies/gemini/) (Multimodal Audit)
- **Settlement Layer**: [Tempo Network](https://tempo.xyz/) (2D Nonces & Parallel Execution)
- **Framework**: Next.js 14, Tailwind CSS, Viem

## 📦 Deployment Info
- **Vault Contract:** `0x0b3012EdaA34872d536CeE2f80D4BfFD6e854B6A`
- **Currency:** pathUSD (6 Decimals) - `0x20C0000000000000000000000000000000000000`
- **Chain ID:** 42431

## 🚀 Getting Started
1. **Install dependencies:** `npm install`
2. **Environment Setup:** Copy `.env.example` to `.env` and set `GEMINI_API_KEY` and `AI_AGENT_PRIVATE_KEY`.
3. **Run Dev:** `npm run dev`

## 🏁 Team
- **Suhas Dasari**: High-Throughput Infrastructure, L1 Parallelism
- **Susmitha Gurram**: AI Audit Engineering, Frontend UX
