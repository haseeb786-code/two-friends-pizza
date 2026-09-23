import { BUSINESS_CONFIG } from '@/config/business';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-neutral-900 text-white font-sans">
      <div className="max-w-xl w-full text-center space-y-6 border border-neutral-800 p-8 rounded-2xl bg-neutral-950/60 shadow-2xl">
        <div className="inline-block px-3 py-1 text-xs uppercase tracking-wider font-semibold rounded-full bg-red-600/20 text-red-400 border border-red-500/30">
          Architecture Foundation Ready
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          {BUSINESS_CONFIG.name}
        </h1>
        <p className="text-sm text-neutral-400">
          {BUSINESS_CONFIG.tagline}
        </p>
        <div className="pt-4 border-t border-neutral-800 text-xs text-neutral-500 space-y-1 text-left">
          <p>✓ Part 1 of 5: Project Init, Architecture & Data Contracts</p>
          <p>✓ State Engine: Zustand Cart Store Configured</p>
          <p>✓ Types Layer: Menu, Cart, Order, and Business Domains Defined</p>
          <p>⏳ Part 2 Pending: 3D Scene, Motion, and Visual Design Tokens</p>
        </div>
      </div>
    </main>
  );
}
