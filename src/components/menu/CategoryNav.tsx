'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

export type MenuTabId = 'pizza' | 'pizza-local' | 'burger' | 'shawarma' | 'fries' | 'pasta' | 'crispy' | 'deals';

const TABS: { id: MenuTabId; label: string; emoji: string }[] = [
  { id: 'pizza',       label: 'Signature Pizzas',  emoji: '🍕' },
  { id: 'pizza-local', label: 'Local Pizzas',       emoji: '🔥' },
  { id: 'burger',      label: 'Burgers',            emoji: '🍔' },
  { id: 'shawarma',    label: 'Shawarma',           emoji: '🌯' },
  { id: 'fries',       label: 'Fries',              emoji: '🍟' },
  { id: 'pasta',       label: 'Pasta',              emoji: '🍝' },
  { id: 'crispy',      label: 'Crispy',             emoji: '🍗' },
  { id: 'deals',       label: 'Deals',              emoji: '🎁' },
];

interface CategoryNavProps {
  activeTab: MenuTabId;
  onChange: (id: MenuTabId) => void;
}

/**
 * Horizontally scrollable sticky category nav.
 * - Active tab indicator scrolls into view automatically.
 * - Keyboard navigable (left/right arrow keys).
 * - Never wraps onto two lines — scrolls on small screens.
 */
export function CategoryNav({ activeTab, onChange }: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active tab into view on change
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [activeTab]);

  function handleKeyDown(e: React.KeyboardEvent, currentIndex: number) {
    if (e.key === 'ArrowRight') {
      const next = TABS[(currentIndex + 1) % TABS.length];
      onChange(next.id);
    }
    if (e.key === 'ArrowLeft') {
      const prev = TABS[(currentIndex - 1 + TABS.length) % TABS.length];
      onChange(prev.id);
    }
  }

  return (
    <nav
      aria-label="Menu categories"
      className="sticky top-[4.5rem] z-30 bg-obsidian-950/95 backdrop-blur-md border-b border-white/[0.07] -mx-4 sm:-mx-8 lg:-mx-12 xl:-mx-16 px-4 sm:px-8 lg:px-12 xl:px-16"
    >
      <div
        ref={scrollRef}
        className="flex items-center gap-1 overflow-x-auto scrollbar-none py-3"
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
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0',
                isActive
                  ? 'bg-flame-600 text-white shadow-sm'
                  : 'text-obsidian-400 hover:text-white hover:bg-white/5'
              )}
            >
              <span aria-hidden="true">{tab.emoji}</span>
              {tab.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
