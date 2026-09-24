'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type MenuTabId = 'pizza' | 'pizza-local' | 'burger' | 'shawarma' | 'fries' | 'pasta' | 'crispy' | 'deals';

const TABS: { id: MenuTabId; label: string; shortLabel: string }[] = [
  { id: 'pizza',       label: 'Signature',    shortLabel: 'Signature' },
  { id: 'pizza-local', label: 'Local',         shortLabel: 'Local' },
  { id: 'burger',      label: 'Burgers',       shortLabel: 'Burgers' },
  { id: 'shawarma',    label: 'Shawarma',      shortLabel: 'Shawarma' },
  { id: 'fries',       label: 'Fries',         shortLabel: 'Fries' },
  { id: 'pasta',       label: 'Pasta',         shortLabel: 'Pasta' },
  { id: 'crispy',      label: 'Crispy',        shortLabel: 'Crispy' },
  { id: 'deals',       label: 'Deals',         shortLabel: 'Deals' },
];

interface CategoryNavProps {
  activeTab: MenuTabId;
  onChange: (id: MenuTabId) => void;
}

/**
 * Premium sticky category nav — pill-style tabs
 * ──────────────────────────────────────────────
 * Mobile: horizontal scroll, compact pill buttons, no emojis (cleaner).
 * Active state: solid pill with subtle shadow.
 * Keyboard: left/right arrow navigation.
 * Auto-scroll active pill into view on change.
 */
export function CategoryNav({ activeTab, onChange }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const button = activeRef.current;
      const scrollLeft = button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeTab]);

  function handleKeyDown(e: React.KeyboardEvent, currentIndex: number) {
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % TABS.length;
    if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + TABS.length) % TABS.length;
    if (nextIndex !== currentIndex) {
      e.preventDefault();
      onChange(TABS[nextIndex].id);
    }
  }

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-14 sm:top-16 z-30 -mx-4 sm:-mx-6 lg:-mx-8"
    >
      {/* Subtle top edge line */}
      <div className="bg-obsidian-950/95 backdrop-blur-lg border-b border-white/[0.06]">
        <div
          ref={scrollRef}
          className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-2.5 px-4 sm:px-6 lg:px-8"
          role="tablist"
          aria-label="Menu sections"
        >
          {TABS.map((tab, index) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeRef : null}
                role="tab"
                aria-selected={isActive}
                aria-controls={`menu-section-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => onChange(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  'px-3 sm:px-3.5 py-[6px] rounded-full text-[12px] sm:text-[13px] font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer flex-shrink-0',
                  isActive
                    ? 'bg-white text-obsidian-950 shadow-sm'
                    : 'text-obsidian-500 hover:text-obsidian-200 active:bg-white/[0.06]'
                )}
              >
                {tab.shortLabel}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
