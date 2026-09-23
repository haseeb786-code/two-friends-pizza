import { CheckCircle2, Clock, Flame } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/config/business';
import { Badge } from '@/components/ui/Badge';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-canvas text-white">
      <div className="max-w-xl w-full text-center space-y-6 border border-white/10 p-8 rounded-2xl bg-surface shadow-ambient">
        <div className="flex justify-center">
          <Badge variant="flame" className="flex items-center gap-1.5 py-1 px-3">
            <Flame className="w-3.5 h-3.5 text-flame-400" aria-hidden="true" />
            <span>Architecture & Performance Foundation</span>
          </Badge>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-heading font-bold tracking-tight text-white">
            {BUSINESS_CONFIG.name}
          </h1>
          <p className="text-sm text-obsidian-300 font-sans">
            {BUSINESS_CONFIG.tagline}
          </p>
        </div>

        <div className="pt-6 border-t border-white/10 text-xs text-obsidian-400 space-y-2.5 text-left">
          <div className="flex items-center gap-2 text-obsidian-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Part 1: Initialized Next.js 15, Domain Types, Zustand Store & Data Separation</span>
          </div>
          <div className="flex items-center gap-2 text-obsidian-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Part 2: 3-Tier Design Tokens, Selective 3D WebGL Pipeline & Motion System</span>
          </div>
          <div className="flex items-center gap-2 text-obsidian-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
            <span>Part 3: Performance, Next.js Metadata/SEO, WCAG Accessibility & UI Primitives</span>
          </div>
          <div className="flex items-center gap-2 text-amber-400 pt-2 border-t border-white/5">
            <Clock className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Part 4 Ready: Full Experience, Hero Showcase, 3D Integration & Menu Layout</span>
          </div>
        </div>
      </div>
    </main>
  );
}
