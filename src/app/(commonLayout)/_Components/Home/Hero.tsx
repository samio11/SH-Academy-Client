"use client";

import Threads from "@/components/Threads";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative w-full h-[1000px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#0a0a0a] to-black">
      {/* Background Animation */}
      <div className="absolute inset-0 opacity-50">
        {/* <Threads
          amplitude={5}
          distance={0}
          enableMouseInteraction={true}
          className="w-full h-full"
        /> */}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-4xl px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
          <span className="bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent drop-shadow-md">
            SH-Academy
          </span>
          <span className="block text-white mt-3">
            Empower Your Future
            <br /> Through Learning
          </span>
        </h1>

        <p className="text-gray-300 mt-6 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
          Master new skills with industry-leading courses — Unlock your career
          potential from anywhere in the world.
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex justify-center gap-5">
          <Link href="/courses">
            <Button className="px-7 py-3 text-base font-medium rounded-xl bg-black border border-gray-600 hover:bg-gray-900 hover:border-gray-400 transition-all">
              Explore Courses
            </Button>
          </Link>
          <Link href="/register">
            <Button className="px-7 py-3 text-base font-medium rounded-xl bg-white text-black hover:bg-gray-300 transition-all">
              Get Started
            </Button>
          </Link>
        </div>
      </div>

      {/* Soft Glow Gradient */}
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black to-transparent"></div>
    </section>
  );
}
