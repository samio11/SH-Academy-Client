"use client";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Subscription = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed Email:", email);
    setEmail("");
  };

  return (
    <section className="relative bg-black text-white py-20 px-4 overflow-hidden">
      {/* Glowing Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-black to-[#1a1a1a] opacity-80"></div>

      <div className="relative container mx-auto text-center">
        <span className="text-sm tracking-wider text-gray-400 uppercase">
          Join Our Learning Community
        </span>

        <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
          Get Exclusive Course Updates & Offers
        </h2>

        <p className="text-gray-300 max-w-2xl mx-auto mb-10">
          Subscribe to SH-Academy and stay ahead with new learning paths,
          career-boosting content and special discounts.
        </p>

        <form
          onSubmit={handleSubscribe}
          className="flex flex-col md:flex-row items-center gap-4 justify-center"
        >
          <div className="relative w-full md:w-96">
            <Mail
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-[#111] text-white border-gray-600 pl-10 py-6 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            className="px-8 py-6 rounded-lg font-semibold bg-white text-black hover:bg-gray-200 transition-all"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
};

export default Subscription;
