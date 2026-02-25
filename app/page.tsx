'use client';

import { useState } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'viem/chains';

export default function Page() {
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isBaseApp =
    typeof window !== 'undefined' &&
    window.ethereum &&
    navigator.userAgent.toLowerCase().includes('base');

  const sendTx = async () => {
    try {
      setError(null);

      if (!window.ethereum) {
        throw new Error('No wallet found');
      }

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: accounts[0],
            to: accounts[0], // можно поменять адрес
            value: '0x2386F26FC10000', // 0.01 ETH → поменяй если надо
            chainId: '0x2105', // Base Mainnet
          },
        ],
      });

      setTxHash(txHash);
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    }
  };

  return (
    <OnchainKitProvider chain={base}>
      <main style={{ padding: 24, textAlign: 'center' }}>
        <h1>Base Mini App</h1>

        {!isBaseApp && <p>❌ Open this app inside Base App</p>}

        {isBaseApp && (
          <>
            <button
              onClick={sendTx}
              style={{
                padding: '12px 20px',
                fontSize: 16,
                cursor: 'pointer',
              }}
            >
              Send Transaction
            </button>

            {txHash && (
              <p style={{ marginTop: 16 }}>
                ✅ Tx sent:
                <br />
                <a
                  href={`https://basescan.org/tx/${txHash}`}
                  target="_blank"
                >
                  {txHash}
                </a>
              </p>
            )}

            {error && (
              <p style={{ marginTop: 16, color: 'red' }}>
                ❌ {error}
              </p>
            )}
          </>
        )}
      </main>
    </OnchainKitProvider>
  );
}