# Parallel Pantry

A decentralized, AI-verified community treasury capped at $50 per person to provide instant relief (food, gas, bills) to students and community members.

## Project Overview

This project uses:
-   **Next.js 14** (App Router)
-   **Tailwind CSS** (Styling)
-   **Privy Auth** (Passkeys & Identity)
-   **Gemini AI** (Proof of Need Verification)
-   **Tempo Blockchain** (Settlement Layer)

## Prerequisites

-   Node.js 18+ installed
-   Git installed

## Getting Started

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd Parallel-Pantry
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Setup:**
    -   Copy the example environment file:
        ```bash
        cp .env.example .env
        ```
    -   Fill in your API keys in the `.env` file:
        -   `NEXT_PUBLIC_PRIVY_APP_ID`: Your Privy App ID (from Privy Dashboard)
        -   `PRIVY_APP_SECRET`: Your Privy App Secret (from Privy Dashboard)
        -   `GEMINI_API_KEY`: Your Google Gemini API Key
        -   `NEXT_PUBLIC_TEMPO_RPC_URL`: Tempo RPC URL (if connecting to custom node)

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the application:**
    -   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

-   `/app`: Main application routes and pages
    -   `/`: Dashboard with Donate/Request buttons
    -   `/donate`: Donation page (Under Construction)
    -   `/request`: Relief request page (Under Construction)
-   `/components`: Reusable UI components
    -   `Providers.tsx`: Authentication and context providers
-   `/public`: Static assets

## Tempo Network & Smart Contract

This project is deployed on the **Tempo Testnet (Moderato)**.

-   **Chain ID:** 42431
-   **RPC URL:** `https://rpc.moderato.tempo.xyz`
-   **Currency:** USD (pathUSD)
-   **Vault Contract Address:** `0x0b3012EdaA34872d536CeE2f80D4BfFD6e854B6A`
-   **pathUSD Token Address:** `0x20C0000000000000000000000000000000000000`

The vault contract manages community donations and is integrated with our AI verification system for secure withdrawals.

## Team

-   **Developer Suhas**: Backend, L1 Integration, Identity
-   **Developer Susmitha**: Frontend, Camera Integration, AI Auditor
