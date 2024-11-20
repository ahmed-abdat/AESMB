"use client";

import { Team } from "@/types/team";
import { motion } from "framer-motion";
import { TeamsSection } from "@/components/dashboard/teams/TeamsSection";
import { useState, useEffect } from "react";
import { subscribeToTeams } from "@/lib/firebase/subscriptions";
import { toast } from "sonner";

interface TeamsPageContentProps {
  initialTeams: Team[];
}

export function TeamsPageContent({ initialTeams }: TeamsPageContentProps) {
  const [teams, setTeams] = useState<Team[]>(initialTeams);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = subscribeToTeams((updatedTeams) => {
      setTeams(updatedTeams);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <main className="min-h-[calc(100vh-5rem)] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <TeamsSection 
          teams={teams} 
        />
      </motion.div>
    </main>
  );
} 