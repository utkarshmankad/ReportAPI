import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Pricing } from "@/components/sections/Pricing";
import { Demo } from "@/components/sections/Demo";

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
      <Demo />
    </main>
  );
}
