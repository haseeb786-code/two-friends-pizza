'use client';

import { motion } from 'framer-motion';
import { Crown, GraduationCap, PartyPopper } from 'lucide-react';
import { DealCard } from './DealCard';
import { STUDENT_DEALS, OCCASION_DEALS, MEMBERS_DEALS } from '@/data/deals';
import { staggerContainerVariants, productCardVariants } from '@/lib/motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * Deals Section — three visually distinct sub-groups:
 *   1. Student Deals — accessible, everyday value
 *   2. Occasion / Group Deals — celebratory, large groups
 *   3. Members-Only Deals — "Already Discounted", gold visual treatment
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
    <div className="space-y-16">

      {/* ── Student Deals ── */}
      <div>
        <DealGroupHeader
          icon={<GraduationCap className="w-5 h-5" aria-hidden="true" />}
          label="Student Deals"
          description="Everyday value designed for students. Quick, filling, affordable."
          accentClass="text-flame-400"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
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
          icon={<PartyPopper className="w-5 h-5" aria-hidden="true" />}
          label="Occasion & Group Deals"
          description="Celebrate big — birthday feasts, party spreads, and friend bundles."
          accentClass="text-flame-400"
        />
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6"
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
        {/* Distinct visual treatment — gold banner header */}
        <div className="relative rounded-2xl border border-amber-500/25 bg-gradient-to-br from-amber-950/20 to-transparent p-6 mb-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/[0.05] rounded-full blur-3xl" />
          </div>
          <div className="relative flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center">
              <Crown className="w-5 h-5 text-amber-400" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-amber-300">
                Already Discounted — Members Only
              </h3>
              <p className="text-sm text-obsidian-400 mt-1">
                These prices are already our lowest. No code needed — just show this to our team.
              </p>
            </div>
          </div>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
    <div className="flex items-start gap-3">
      <div className={`flex-shrink-0 mt-0.5 ${accentClass}`}>{icon}</div>
      <div>
        <h3 className={`font-heading text-xl font-bold text-white`}>{label}</h3>
        <p className="text-sm text-obsidian-400 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
