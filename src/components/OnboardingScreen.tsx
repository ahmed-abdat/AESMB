"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconChevronRight } from "@tabler/icons-react";
import Lottie from "lottie-react";
import trophyAnimation from "@/animations/business-win.json";
import teamAnimation from "@/animations/business-team.json";
import offlineAnimation from "@/animations/cloud-connectivity.json";

const DRAG_THRESHOLD = 50; // Minimum drag distance to trigger slide change

const slides = [
  {
    title: "Suivez les Classements",
    description:
      "Consultez en temps réel les classements, les statistiques des équipes et des joueurs",
    animation: trophyAnimation,
  },
  {
    title: "Gérez Votre Équipe",
    description:
      "Accédez aux performances de votre équipe et suivez les statistiques de vos joueurs",
    animation: teamAnimation,
  },
  {
    title: "Mode Hors Ligne",
    description: "Profitez de l'application même sans connexion internet",
    animation: offlineAnimation,
  },
];

export function OnboardingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dragDirection, setDragDirection] = useState<'left' | 'right' | null>(null);

  const handleDragEnd = (e: any, info: PanInfo) => {
    const { offset } = info;
    if (Math.abs(offset.x) > DRAG_THRESHOLD) {
      if (offset.x > 0 && currentSlide > 0) {
        // Dragged right, go to previous slide
        setCurrentSlide(prev => prev - 1);
      } else if (offset.x < 0 && currentSlide < slides.length - 1) {
        // Dragged left, go to next slide
        setCurrentSlide(prev => prev + 1);
      }
    }
  };

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      // Store that onboarding is complete
      localStorage.setItem('onboardingComplete', 'true');
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-background overflow-hidden touch-pan-y"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted opacity-80"
        style={{ pointerEvents: "none" }}
      />

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors px-4 py-2 text-sm font-medium z-10"
      >
        Passer
      </button>

      {/* Main content container */}
      <div className="relative h-full flex flex-col justify-between max-w-md mx-auto px-4 py-8">
        {/* Slides container */}
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="w-full touch-pan-x"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ 
                  x: dragDirection === 'left' ? 50 : -50,
                  opacity: 0 
                }}
                animate={{ 
                  x: 0,
                  opacity: 1 
                }}
                exit={{ 
                  x: dragDirection === 'left' ? -50 : 50,
                  opacity: 0 
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full"
              >
                <div className="flex flex-col items-center">
                  {/* Lottie Animation */}
                  <motion.div 
                    className="relative w-64 h-64 mb-8"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Lottie
                      animationData={slides[currentSlide].animation}
                      loop={true}
                      className="w-full h-full"
                    />
                  </motion.div>

                  {/* Text content */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-center space-y-4"
                  >
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                      {slides[currentSlide].title}
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg max-w-xs sm:max-w-sm mx-auto">
                      {slides[currentSlide].description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom navigation section */}
        <div className="space-y-8">
          {/* Progress dots */}
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: index === currentSlide ? 1 : 0.8, 
                  opacity: 1 
                }}
                transition={{ delay: index * 0.1 }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${
                  index === currentSlide 
                    ? "w-8 bg-primary" 
                    : "w-2 bg-primary/30 hover:bg-primary/50"
                }`}
                onClick={() => {
                  setDragDirection(index > currentSlide ? 'left' : 'right');
                  setCurrentSlide(index);
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-4">
            {currentSlide > 0 && (
              <Button 
                variant="outline"
                className="flex-1 h-12 text-base font-medium rounded-lg"
                onClick={() => {
                  setDragDirection('right');
                  setCurrentSlide(prev => prev - 1);
                }}
              >
                Précédent
              </Button>
            )}
            <Button 
              className={`h-12 text-base font-medium rounded-lg ${currentSlide === 0 ? 'w-full' : 'flex-1'}`}
              onClick={() => {
                setDragDirection('left');
                handleNext();
              }}
            >
              {currentSlide === slides.length - 1 ? "Commencer l'expérience" : "Suivant"}
              <IconChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
