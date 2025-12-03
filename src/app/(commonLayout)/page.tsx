import React from "react";

import Hero from "./_Components/Home/Hero";
import { FeaturesSection } from "./_Components/Home/Feature";
import CourseSection from "./_Components/Home/CourseSection";
import { HowItWorks } from "./_Components/Home/HowItWorks";

import Subscription from "./_Components/Home/Subscription";

export default function Home() {
  return (
    <div>
      <Hero></Hero>
      <FeaturesSection></FeaturesSection>
      <section className="mt-10">
        <CourseSection />
      </section>
      <HowItWorks></HowItWorks>
      <Subscription></Subscription>
    </div>
  );
}
