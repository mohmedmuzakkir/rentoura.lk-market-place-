import { useEffect, useState } from 'react';

const DISPLAY_DURATION_MS = 2400;
const EXIT_DURATION_MS = 350;
const FAILSAFE_DURATION_MS = 3000;

export function SplashScreen() {
  const [phase, setPhase] = useState<'visible' | 'exiting' | 'hidden'>('visible');

  useEffect(() => {
    const exitTimer = window.setTimeout(() => setPhase('exiting'), DISPLAY_DURATION_MS);
    const removeTimer = window.setTimeout(
      () => setPhase('hidden'),
      DISPLAY_DURATION_MS + EXIT_DURATION_MS,
    );
    const failsafeTimer = window.setTimeout(() => setPhase('hidden'), FAILSAFE_DURATION_MS);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(removeTimer);
      window.clearTimeout(failsafeTimer);
    };
  }, []);

  if (phase === 'hidden') return null;

  return (
    <div
      className={`boot-splash${phase === 'exiting' ? ' boot-splash--exiting' : ''}`}
      role="status"
      aria-label="RENTOURA.LK is loading"
    >
      <div className="boot-splash__backdrop" aria-hidden="true" />
      <img
        className="boot-splash__artwork"
        src="/brand/rentoura-splash.png"
        alt=""
        aria-hidden="true"
        fetchPriority="high"
      />
    </div>
  );
}
