"use client";

import { useEffect, useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "viem/chains";

export default function Page() {
  const [insideBase, setInsideBase] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isBase =
      (window as any)?.ethereum?.isCoinbaseWallet === true;

    setInsideBase(isBase);
  }, []);

  return (
    <OnchainKitProvider chain={base}>
      <main
        style={{
          padding: 24,
          textAlign: "center",
          fontFamily: "sans-serif",
        }}
      >
        <h1>Base Mini App</h1>

        {insideBase ? (
          <h2 style={{ color: "green" }}>
            ✅ Opened inside Base App
          </h2>
        ) : (
          <h2 style={{ color: "red" }}>
            ❌ Not opened in Base App
          </h2>
        )}
      </main>
    </OnchainKitProvider>
  );
}