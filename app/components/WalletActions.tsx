'use client';

import { useMemo, useState } from 'react';
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
  useSendTransaction,
} from 'wagmi';
import { base } from 'wagmi/chains';
import { parseEther } from 'viem';

export default function WalletActions() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const { sendTransactionAsync, isPending: isSending } = useSendTransaction();

  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isBase = chainId === base.id;

  const short = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 6)}…${address.slice(-4)}`;
  }, [address]);

  async function handleSendToSelf() {
    try {
      setError(null);
      setTxHash(null);

      if (!address) throw new Error('No wallet connected');

      const value = parseEther('0.000001');

      const hash = await sendTransactionAsync({
        to: address,
        value,
        chainId: base.id,
      });

      setTxHash(hash);
    } catch (e: any) {
      setError(e?.message ?? 'Transaction failed');
    }
  }

  return (
    <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <h2 style={{ margin: 0 }}>Wallet</h2>

      {!isConnected ? (
        <div style={{ display: 'grid', gap: 8 }}>
          {connectors.map((c) => (
            <button
              key={c.uid}
              onClick={() => connect({ connector: c })}
              disabled={isConnecting}
              style={{ padding: 12, borderRadius: 10, cursor: 'pointer' }}
            >
              Connect: {c.name}
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          <div>
            <div>
              <b>Connected:</b> {short}
            </div>
            <div>
              <b>Chain:</b> {isBase ? 'Base' : `Not Base (id: ${chainId})`}
            </div>
          </div>

          {!isBase ? (
            <button
              onClick={() => switchChain({ chainId: base.id })}
              disabled={isSwitching}
              style={{ padding: 12, borderRadius: 10, cursor: 'pointer' }}
            >
              Switch to Base
            </button>
          ) : (
            <button
              onClick={handleSendToSelf}
              disabled={isSending}
              style={{ padding: 12, borderRadius: 10, cursor: 'pointer' }}
            >
              Send tx to self (0.000001 ETH)
            </button>
          )}

          <button
            onClick={() => disconnect()}
            style={{ padding: 12, borderRadius: 10, cursor: 'pointer' }}
          >
            Disconnect
          </button>

          {txHash && (
            <div style={{ wordBreak: 'break-all' }}>
              ✅ Tx sent: <b>{txHash}</b>
            </div>
          )}

          {error && <div style={{ color: 'tomato' }}>❌ {error}</div>}
        </div>
      )}
    </div>
  );
}