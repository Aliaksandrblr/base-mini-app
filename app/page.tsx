'use client';

import { useMemo, useState } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';

export default function Home() {
  const [score, setScore] = useState(0);
  const { address, isConnected } = useAccount();

  // Proof-транзакция: отправка 0 ETH самому себе (газ всё равно будет)
  const to = useMemo(() => address, [address]);

  const { sendTransaction, isPending, isSuccess, error } = useSendTransaction();

  const onPlay = () => setScore((s) => s + 1);

  const onOnchainProof = () => {
    if (!to) return;
    sendTransaction({
      to,
      value: parseEther('0'),
    });
  };

  return (
    <main style={styles.main}>
      <div style={styles.card}>
        <div style={styles.headerRow}>
          <div>
            <div style={styles.title}>Base Mini Game</div>
            <div style={styles.subtitle}>1-click clicker + onchain proof tx (Base mainnet)</div>
          </div>
          <div style={styles.badge}>{isConnected ? 'Wallet connected' : 'Open in Base App'}</div>
        </div>

        <div style={styles.scoreBox}>
          <div style={styles.scoreLabel}>Score</div>
          <div style={styles.score}>{score}</div>
          <button onClick={onPlay} style={styles.primaryBtn}>
            Play (+1)
          </button>
        </div>

        <div style={styles.divider} />

        <div style={styles.section}>
          <div style={styles.sectionTitle}>Onchain proof</div>
          <div style={styles.sectionText}>
            Sends a minimal transaction on <b>Base mainnet</b>. No value transfer, just proof of interaction.
          </div>

          <button
            onClick={onOnchainProof}
            style={{ ...styles.secondaryBtn, opacity: !isConnected || isPending ? 0.6 : 1 }}
            disabled={!isConnected || isPending}
          >
            {isPending ? 'Sending…' : 'Send proof tx'}
          </button>

          {isSuccess && <div style={styles.success}>✅ Sent. Check your wallet activity.</div>}
          {error && <div style={styles.error}>⚠️ {error.message}</div>}
        </div>

        <div style={styles.footer}>
          <div style={styles.mono}>Connected address:</div>
          <div style={styles.mono}>{address ?? '—'}</div>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    display: 'grid',
    placeItems: 'center',
    padding: 16,
    background: 'linear-gradient(180deg, #0b1020 0%, #070a12 100%)',
    color: 'white',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Apple Color Emoji, Segoe UI Emoji',
  },
  card: {
    width: 'min(720px, 100%)',
    borderRadius: 16,
    padding: 18,
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.35)',
  },
  headerRow: { display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 800, letterSpacing: 0.2 },
  subtitle: { opacity: 0.8, fontSize: 13, marginTop: 4 },
  badge: {
    fontSize: 12,
    padding: '6px 10px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.16)',
    background: 'rgba(0,0,0,0.25)',
    whiteSpace: 'nowrap',
  },
  scoreBox: {
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(0,0,0,0.20)',
    display: 'grid',
    gap: 10,
    justifyItems: 'start',
  },
  scoreLabel: { opacity: 0.7, fontSize: 12 },
  score: { fontSize: 44, fontWeight: 900, lineHeight: 1 },
  primaryBtn: {
    border: 'none',
    borderRadius: 12,
    padding: '10px 14px',
    fontWeight: 800,
    cursor: 'pointer',
  },
  divider: { height: 1, background: 'rgba(255,255,255,0.10)', margin: '16px 0' },
  section: { display: 'grid', gap: 10 },
  sectionTitle: { fontWeight: 800 },
  sectionText: { opacity: 0.85, fontSize: 13, lineHeight: 1.4 },
  secondaryBtn: {
    borderRadius: 12,
    padding: '10px 14px',fontWeight: 800,
    cursor: 'pointer',
    border: '1px solid rgba(255,255,255,0.18)',
    background: 'rgba(0,0,0,0.25)',
    color: 'white',
  },
  success: { marginTop: 6, fontSize: 13, opacity: 0.9 },
  error: { marginTop: 6, fontSize: 13, color: '#ffb4b4' },
  footer: { marginTop: 14, opacity: 0.8, fontSize: 12, display: 'grid', gap: 4 },
  mono: {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
};