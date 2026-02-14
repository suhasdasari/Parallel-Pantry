"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export default function Providers({ children }: { children: React.ReactNode }) {
    const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

    if (!appId) {
        return (
            <div className="flex h-screen w-full items-center justify-center text-white p-10 text-center">
                <div>
                    <h1 className="text-2xl font-bold text-red-500 mb-4">Configuration Error</h1>
                    <p>Missing <code>NEXT_PUBLIC_PRIVY_APP_ID</code> in <code>.env</code> file.</p>
                    <p className="text-sm text-gray-400 mt-2">Please add your Privy App ID and restart the server.</p>
                </div>
            </div>
        );
    }

    return (
        <PrivyProvider
            appId={appId}
            config={{
                appearance: {
                    theme: "dark",
                    accentColor: "#10B981", // Brand Green
                    logo: "https://your-logo-url", // Placeholder
                },
                loginMethods: ["email", "wallet"],
                // embeddedWallets configuration removed to fix type error
            }}
        >
            {children}
        </PrivyProvider>
    );
}
