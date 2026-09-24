'use client';

import { motion } from 'framer-motion';
import { Crown, GraduationCap, Users } from 'lucide-react';
import { DealCard } from './DealCard';
import { STUDENT_DEALS, OCCASION_DEALS, MEMBERS_DEALS } from '@/data/deals';
import { staggerContainerVariants, productCardVariants } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Deals Section — Three sub-groups with clean visual separation
 * No decorative blur orbs or heavy gradients — static luxury.
 */
export function DealsSection() {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : staggerContainerVariants;

  const cardVariants = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : productCardVariants;

  return (
    <div className="space-y-12 sm:space-y-14">

      {/* ── Student Deals ── */}
      <div>
        <DealGroupHeader
          icon={<GraduationCap className="w-4 h-4" aria-hidden="true" />}
          label="Student Deals"
          description="Quick, filling, affordable."
          accentClass="text-flame-500"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-5"
        >
          {STUDENT_DEALS.map((deal) => (
            <motion.div key={deal.id} variants={cardVariants}>
              <DealCard deal={deal} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Occasion / Group Deals ── */}
      <div>
        <DealGroupHeader
          icon={<Users className="w-4 h-4" aria-hidden="true" />}
          label="Occasion & Group Deals"
          description="Birthday feasts, party spreads, and friend bundles."
          accentClass="text-flame-500"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-5"
        >
          {OCCASION_DEALS.map((deal) => (
            <motion.div key={deal.id} variants={cardVariants}>
              <DealCard deal={deal} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ── Members-Only Deals ── */}
      <div>
        {/* Clean header banner — no blur, no glow, just structure */}
        <div className="flex items-center gap-3 px-4 py-3 sm:px-5 sm:py-4 rounded-xl border border-amber-600/15 bg-amber-500/[0.04] mb-4 sm:mb-5">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Crown className="w-4 h-4 text-amber-400" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h3 className="font-heading text-[15px] sm:text-base font-bold text-amber-300 leading-tight">
              Already Discounted — Members Only
            </h3>
            <p className="text-[11px] sm:text-xs text-obsidian-500 mt-0.5 leading-snug">
              These prices are already our lowest. Show this to our team.
            </p>
          </div>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        >
          {MEMBERS_DEALS.map((deal) => (
            <motion.div key={deal.id} variants={cardVariants}>
              <DealCard deal={deal} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function DealGroupHeader({
  icon,
  label,
  description,
  accentClass,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  accentClass: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`flex-shrink-0 ${accentClass}`}>{icon}</div>
      <div>
        <h3 className="font-heading text-base sm:text-lg font-bold text-white leading-tight">{label}</h3>
        <p className="text-[11px] sm:text-xs text-obsidian-500 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
