'use client';

import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

export default function Home() {
  const { address, isConnected } = useAccount();
  const { sendTransaction, isPending, isSuccess, error } = useSendTransaction();

  const sendProof = () => {
    if (!address) return;

    sendTransaction({
      to: address,
      value: parseEther('0.000001'), // минимальный proof
    });
  };

  return (
    <main style={{ padding: 24 }}>
      <h1>Base Mini Game</h1>

      {!isConnected && (
        <div>Open this app inside Base App</div>
      )}

      {isConnected && (
        <>
          <button
            onClick={sendProof}
            disabled={isPending}
            style={{ padding: 12, marginTop: 12 }}
          >
            {isPending ? 'Sending…' : 'Send proof tx'}
          </button>

          {isSuccess && <div>✅ Transaction sent</div>}
          {error && <div style={{ color: 'red' }}>{error.message}</div>}
        </>
      )}
    </main>
  );
}