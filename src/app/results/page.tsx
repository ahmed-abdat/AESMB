'use client';

import { MatchCard } from "@/components/matches/MatchCard";
import { Button } from "@/components/ui/button";
import { IconFilter } from "@tabler/icons-react";
import { motion } from "framer-motion";

// Sample data - replace with real data later
const completedMatches = [
  {
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    homeScore: 3,
    awayScore: 1,
    matchTime: "20:45",
    matchDate: "Apr 10, 2024",
    group: "Group A"
  },
  {
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    homeScore: 2,
    awayScore: 2,
    matchTime: "18:30",
    matchDate: "Apr 9, 2024",
    group: "Group B"
  },
  // Add more completed matches...
];

export default function ResultsPage() {
  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Match Results</h1>
          <Button variant="outline" className="gap-2">
            <IconFilter className="w-4 h-4" />
            Filter Results
          </Button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {completedMatches.map((match, index) => (
            <MatchCard key={index} {...match} />
          ))}
        </motion.div>
      </div>
    </main>
  );
} 