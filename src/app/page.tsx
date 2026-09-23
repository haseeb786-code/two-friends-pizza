import { CheckCircle2, Clock, Flame } from 'lucide-react';
import { HeroSection } from '@/components/hero/HeroSection';
import { BUSINESS_CONFIG } from '@/config/business';
import { Badge } from '@/components/ui/Badge';

export default function HomePage() {
  return (
    <main id="main-content">
      {/* Hero Section — Part 4 Prototype */}
      <HeroSection />

      {/* Architectural status indicator — temporary, removed in full build */}
      <section className="flex justify-center py-12 bg-canvas">
        <div className="max-w-sm w-full mx-4 text-center space-y-4 border border-white/10 p-6 rounded-2xl bg-surface">
          <Badge variant="gold">Build Status</Badge>
          <h2 className="font-heading text-lg font-semibold text-white">
            {BUSINESS_CONFIG.name}
          </h2>
          <div className="text-xs text-obsidian-400 space-y-2 text-left">
            <div className="flex items-center gap-2 text-obsidian-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>Parts 1–3: Foundation, Tokens, Performance & Accessibility</span>
            </div>
            <div className="flex items-center gap-2 text-obsidian-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" aria-hidden="true" />
              <span>Part 4: Hero Prototype (3D Architecture + Cinematic Layout)</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Part 5: Full Site Evaluation Pending</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
