import { HeroSection } from '@/components/hero/HeroSection';
import { TrustPillars } from '@/components/features/TrustPillars';
import { ScrollytellingShowcase } from '@/components/showcase/ScrollytellingShowcase';
import { DostiReorderBanner } from '@/components/features/DostiReorderBanner';
import { MenuSection } from '@/components/menu/MenuSection';
import { StorySection } from '@/components/story/StorySection';
import { SiteFooter } from '@/components/layout/SiteFooter';

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero with realistic revolving 3D pizza, oven heat shimmer & steam */}
      <HeroSection />

      {/* 2. Fast food trust & speed pillars tailored for Rawat & Chak Belli Road */}
      <TrustPillars />

      {/* 3. Agency-level scrollytelling: Cheese pull & floating fresh ingredients */}
      <ScrollytellingShowcase />

      {/* 4. Dosti 1-Click Repeat Order Banner (shows only when previous order is stored) */}
      <DostiReorderBanner />

      {/* 5. Complete menu with instant search bar, category tabs, 32 items & 14 deals */}
      <MenuSection />

      {/* 6. Brand story: Dosti Ka Slice on Main Chak Belli Road, Rawat */}
      <StorySection />

      {/* 7. High-impact closing CTA banner & rich local footer */}
      <SiteFooter />
    </main>
  );
}
