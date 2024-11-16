"use client";

import { motion } from "framer-motion";
import { StandingsTable } from "@/components/sections/StandingsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrophy } from "@tabler/icons-react";
import { clubs } from "@/types/tournament-data";
import { useEffect, useState } from "react";

// Sample stats - replace with real calculations later
const tournamentStats = {
  totalMatches: 20,
  totalGoals: 45,
  topScorer: {
    name: "Player Name",
    team: clubs[0].name,
    goals: 5,
  },
  mostCleanSheets: {
    team: clubs[1].name,
    count: 3,
  },
};

export default function StandingsPage() {
  const [highlightedTeam, setHighlightedTeam] = useState<string | null>(null);

  useEffect(() => {
    // Get the hash from URL without the # symbol
    const hash = window.location.hash.slice(1);
    if (hash) {
      setHighlightedTeam(hash);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash.slice(1);
      setHighlightedTeam(newHash || null);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="w-full mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">League Standings</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <IconTrophy className="w-5 h-5" />
            <span>2024-2025 Season</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {/* Main Standings Table */}
          <StandingsTable highlightedTeam={highlightedTeam} />

          {/* Tournament Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Matches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tournamentStats.totalMatches}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Goals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tournamentStats.totalGoals}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Top Scorer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tournamentStats.topScorer.goals}
                </div>
                <div className="text-sm text-muted-foreground">
                  {tournamentStats.topScorer.name} (
                  {tournamentStats.topScorer.team})
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Most Clean Sheets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {tournamentStats.mostCleanSheets.count}
                </div>
                <div className="text-sm text-muted-foreground">
                  {tournamentStats.mostCleanSheets.team}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
