import { Compare } from '@/components/Compare';
import { Facts } from '@/components/Facts';
import { Faq } from '@/components/Faq';
import { FinalCta } from '@/components/FinalCta';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Manifesto } from '@/components/Manifesto';
import { MoveOver } from '@/components/MoveOver';
import { Nav } from '@/components/Nav';
import { Network } from '@/components/Network';
import { Pricing } from '@/components/Pricing';
import { Product } from '@/components/Product';
import { Magnetic } from '@/components/Magnetic';
import { GlassFx } from '@/components/GlassFx';
import { ScrollMotion } from '@/components/ScrollMotion';
import { SmoothScroll } from '@/components/SmoothScroll';
import { Spotlights } from '@/components/Spotlights';

export default function Home() {
  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <Nav />
      <main id="main">
        {/* one colour field behind the end of the hero and the facts, so the glow flows from one into the other */}
        <div className="flow">
          <div className="orbs flow-orbs" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
          <Hero />
          <Facts />
        </div>
        <Manifesto />
        <Product />
        <Spotlights />
        <Network />
        <Pricing />
        <Compare />
        <MoveOver />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
      <SmoothScroll />
      <ScrollMotion />
      <Magnetic />
      <GlassFx />
    </>
  );
}
