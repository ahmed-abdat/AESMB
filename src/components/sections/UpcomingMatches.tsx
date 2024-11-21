"use client";

import { motion } from "framer-motion";
import { MatchCard } from "../matches/MatchCard";
import { Season } from "@/types/season";
import { useMemo } from "react";

interface UpcomingMatchesProps {
  season: Season | undefined;
}

export function UpcomingMatches({ season }: UpcomingMatchesProps) {
  const upcomingMatches = useMemo(() => {
    if (!season?.rounds) return [];

    const now = new Date();

    // Find the next round that has scheduled matches
    const nextRound = season.rounds
      .filter((round) =>
        // Find rounds with at least one scheduled future match
        round.matches.some(
          (match) => match.status === "scheduled" && new Date(match.date) > now
        )
      )
      .sort((a, b) => a.number - b.number)[0]; // Get the earliest round

    if (!nextRound) return [];

    // Get matches from the next round only
    return nextRound.matches
      .filter(
        (match) => match.status === "scheduled" && new Date(match.date) > now
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((match) => ({
        ...match,
        roundNumber: nextRound.number,
      }));
  }, [season]);

  if (!upcomingMatches.length) {
    return null; // Don't show section if no upcoming matches
  }

  return (
    <section className="py-12">
      <div className="w-full mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Prochains Matchs</h2>
            <span className="text-muted-foreground">
              Tour {upcomingMatches[0]?.roundNumber}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingMatches.map((match) => (
              <MatchCard
                key={match.id}
                homeTeamId={match.homeTeamId}
                awayTeamId={match.awayTeamId}
                matchDate={new Date(match.date)}
                status={match.status}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
