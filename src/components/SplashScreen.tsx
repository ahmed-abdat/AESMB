"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { OnboardingScreen } from "./OnboardingScreen";

export function SplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if running as PWA
    const isPWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true; // For iOS

    // If not running as PWA, don't show splash or onboarding
    if (!isPWA) {
      return;
    }

    // Check if onboarding is already completed
    const onboardingComplete = localStorage.getItem("onboardingComplete");
    if (onboardingComplete) {
      return;
    }

    // Show splash and onboarding only for PWA and first time users
    setShowSplash(true);

    // Show splash screen briefly then transition to onboarding
    const timer = setTimeout(() => {
      setShowSplash(false);
      setShowOnboarding(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem("onboardingComplete", "true");
  };

  if (!showSplash && !showOnboarding) return null;

  return (
    <AnimatePresence mode="wait">
      {showSplash ? (
        <motion.div
          key="splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted" />

          <div className="relative flex flex-col items-center space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
              className="relative h-32 w-32"
            >
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-primary/20 to-transparent blur-xl" />
              <div className="relative">
                <Image
                  src="/icons/icon-512.png"
                  alt="Match Champions"
                  width={128}
                  height={128}
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2,
                ease: "easeOut",
              }}
              className="text-center space-y-2"
            >
              <h1 className="text-3xl font-bold">Match Champions</h1>
              <p className="text-muted-foreground">
                Votre compagnon de football
              </p>
            </motion.div>
          </div>
        </motion.div>
      ) : showOnboarding ? (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      ) : null}
    </AnimatePresence>
  );
}
