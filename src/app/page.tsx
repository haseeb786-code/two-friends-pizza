import { HeroSection } from '@/components/hero/HeroSection';
import { MenuSection } from '@/components/menu/MenuSection';

export default function HomePage() {
  return (
    <main id="main-content">
      {/* Hero Section */}
      <HeroSection />

      {/* Full Menu Section */}
      <MenuSection />
    </main>
  );
}
