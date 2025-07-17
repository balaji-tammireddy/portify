"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { HyperText } from "@/components/magicui/hyper-text";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Button } from "@/components/ui/button";
import {Confetti} from "@/components/magicui/confetti";
import { useWindowSize } from "react-use";

export default function Dashboard() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.post("/api/users/userDetails");
        const userId = res.data?.data?._id;
        const name = res.data?.data?.name;

        if (userId && name) {
          setUserName(name);
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Authentication failed:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleGetPortfolio = () => {
    setShowConfetti(true);

    setTimeout(() => {
      router.push("/portfolio");
    }, 1000);
  };

  if (loading) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-black z-50">
      <div
        className="w-12 h-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin"
        role="status"
        aria-label="Loading"
      ></div>
    </div>
  );
}


  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white dark:bg-black overflow-hidden">
      <BackgroundBeams className="absolute inset-0 z-0" />

      {showConfetti && <Confetti width={width} height={height} />}

      <div className="relative z-10 text-center space-y-6">
        <div className="space-y-4">
          <TypingAnimation>Welcome</TypingAnimation>
          <HyperText>{userName ?? ""}</HyperText>
        </div>
        <div className="flex justify-center mt-6">
          <Button
            variant="default"
            className="px-6 py-2"
            onClick={handleGetPortfolio}
          >
            Get My Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
}
