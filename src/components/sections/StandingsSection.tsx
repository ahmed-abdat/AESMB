"use client";

import { motion } from "framer-motion";
import { StandingsTable } from "./StandingsTable";
import { StatsCards } from "./StatsCards";
import { Team } from "@/types/team";
import { SeasonFirestore, Standing } from "@/types/season";

interface StandingsSectionProps {
  season: SeasonFirestore & { id: string };
  teams: Team[];
  standings: Standing[];
}

export function StandingsSection({ season, teams, standings }: StandingsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <StandingsTable standings={standings} teams={teams} />
      <StatsCards season={season} teams={teams} />
    </motion.div>
  );
} 