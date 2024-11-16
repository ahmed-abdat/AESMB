"use client";

import { motion } from "framer-motion";
import { MatchCard } from "../matches/MatchCard";
import { rounds } from "@/types/tournament-data";

export function UpcomingMatches() {
  // Get the next round that hasn't been played yet
  const nextRound = rounds[0]; // For now, showing first round. Later, implement logic to show next unplayed round

  return (
    <section className="py-12">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Prochains Matchs</h2>
            <span className="text-muted-foreground">Tour {nextRound.id}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nextRound.matches.map((match, index) => (
              <MatchCard
                key={index}
                homeTeam={match.homeTeam}
                awayTeam={match.awayTeam}
                matchDate={nextRound.date}
                matchTime={match.time}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
