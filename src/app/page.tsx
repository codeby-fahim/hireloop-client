import { Hero } from "@/components/home/hero";
import JobDiscovery from "@/components/home/JobDiscovery";
import JobFeature from "@/components/home/JobFeature";
import Pricing from "@/components/home/Pricing";

export default function Home() {
  return (
    <main className="flex-1 bg-[#010103]">
      <Hero />
      <JobDiscovery />
      <JobFeature />
      <Pricing />
    </main>
  );
}
