'use client';

import { MatchCard } from "@/components/matches/MatchCard";
import { Button } from "@/components/ui/button";
import { IconCalendar } from "@tabler/icons-react";
import { motion } from "framer-motion";

// Sample data - replace with real data later
const matches = [
  {
    homeTeam: "Barcelona",
    awayTeam: "Real Madrid",
    matchTime: "20:45",
    matchDate: "Apr 15, 2024",
    group: "Group A"
  },
  {
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    homeScore: 2,
    awayScore: 1,
    matchTime: "18:30",
    matchDate: "Apr 14, 2024",
    group: "Group B"
  },
  // Add more matches...
];

export default function MatchesPage() {
  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">All Matches</h1>
          <Button className="gap-2">
            <IconCalendar className="w-4 h-4" />
            Filter by Date
          </Button>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {matches.map((match, index) => (
            <MatchCard key={index} {...match} />
          ))}
        </motion.div>
      </div>
    </main>
  );
} 