"use client";

import { useRouter } from "next/navigation";
import { InteractiveHoverButton } from "@/components/magicui/interactive-hover-button";
import { AuroraText } from "@/components/magicui/aurora-text";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export default function LandingPage() {
  const router = useRouter();

  return (
    <BackgroundBeamsWithCollision>
      <main className="min-h-screen bg-gradient-to-b from-white to-gray-100 flex flex-col">
        <section className="flex flex-1 items-center justify-center px-4">
          <div className="text-center max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Build Your Dream Portfolio with{" "}
              <AuroraText>Portify</AuroraText>
            </h1>
            <p className="text-gray-600 text-lg md:text-xl mb-8">
              A modern portfolio builder for developers and designers. Host, manage, and showcase your work effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <InteractiveHoverButton
                className="px-6 py-3 text-lg"
                onClick={() => router.push("/login")}
              >
                Login
              </InteractiveHoverButton>
              <InteractiveHoverButton
                className="px-6 py-3 text-lg"
                onClick={() => router.push("/signup")}
              >
              Get Started
              </InteractiveHoverButton>
            </div>
          </div>
        </section>
      </main>
    </BackgroundBeamsWithCollision>
  );
}
