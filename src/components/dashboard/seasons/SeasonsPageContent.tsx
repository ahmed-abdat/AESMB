"use client";

import { Season } from "@/types/season";
import { motion } from "framer-motion";
import { SeasonsSection } from "./SeasonsSection";
import { useState, useEffect } from "react";
import { subscribeToSeasons } from "@/lib/firebase/subscriptions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

interface SeasonsPageContentProps {
  initialSeasons: Season[];
}

export function SeasonsPageContent({ initialSeasons }: SeasonsPageContentProps) {
  const [seasons, setSeasons] = useState<Season[]>(initialSeasons);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToSeasons((updatedSeasons) => {
      setSeasons(updatedSeasons);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <IconArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SeasonsSection seasons={seasons} />
      </motion.div>
    </div>
  );
} 