"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Boxes } from "@/components/ui/background-boxes";

export default function Hero() {
  return (
    <section className="relative w-full h-[1000px] flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Background Boxes from Aceternity UI */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Boxes />
      </div>

      {/* Enhanced gradient overlays */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900/90 via-slate-900/50 to-black/80 z-10" />
      <div className="absolute inset-0 w-full h-full bg-slate-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-30 text-center max-w-4xl px-6">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
          <span className="bg-gradient-to-r from-white via-blue-100 to-gray-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)] animate-pulse-slow block">
            SH-Academy
          </span>
          <span className="block mt-6">
            <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              Empower Your Future
            </span>
          </span>
        </h1>

        {/* CTA Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row justify-center gap-6">
          <Link href="/courses" className="group relative">
            <Button className="px-10 py-7 text-lg font-semibold rounded-2xl bg-black/40 backdrop-blur-xl border border-slate-700 hover:border-blue-500/50 hover:bg-blue-950/30 transition-all duration-300 shadow-2xl shadow-blue-500/20 relative overflow-hidden">
              <span className="relative z-10 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent">
                Explore Courses
              </span>
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          </Link>

          <Link href="/register" className="group relative">
            <Button className="px-10 py-7 text-lg font-semibold rounded-2xl bg-gradient-to-r from-white to-blue-100 text-black hover:from-blue-50 hover:to-white hover:scale-105 transition-all duration-300 shadow-2xl shadow-white/20 relative overflow-hidden">
              <span className="relative z-10">Get Started Free</span>
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </Button>
            <div className="absolute -inset-1 bg-gradient-to-r from-white/30 to-blue-100/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          </Link>
        </div>

        {/* Stats Cards */}
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute inset-x-0 bottom-0 h-80 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent z-20" />
    </section>
  );
}
