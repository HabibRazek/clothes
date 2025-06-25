import Hero from "@/components/landing/hero";
import Component from "@/components/landing/newsfeed-section";
import Navbar from "@/components/navigation/navbar";

export default function Home() {
  return (
    <div>
      <Navbar/>
      <Hero/>
      <Component />
    </div>
  );
}
