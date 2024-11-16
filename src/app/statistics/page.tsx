'use client';

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconBallFootball, IconTrophy, IconUsers } from "@tabler/icons-react";

// Sample data - replace with real data later
const statistics = {
  topScorers: [
    { player: "Haaland", team: "Man City", goals: 7 },
    { player: "Lewandowski", team: "Barcelona", goals: 5 },
    { player: "Kane", team: "Bayern Munich", goals: 6 },
  ],
  teamStats: [
    { stat: "Most Goals", team: "Manchester City", value: "18 goals" },
    { stat: "Best Defense", team: "Barcelona", value: "3 goals against" },
    { stat: "Longest Win Streak", team: "Manchester City", value: "6 matches" },
  ],
  tournamentStats: {
    totalMatches: 30,
    totalGoals: 82,
    averageGoals: 2.73,
    cleanSheets: 12,
  }
};

export default function StatisticsPage() {
  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="w-full mx-auto px-4 md:px-8">
        <h1 className="text-3xl font-bold mb-8">Tournament Statistics</h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {/* Top Scorers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBallFootball className="w-5 h-5" />
                Top Scorers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statistics.topScorers.map((scorer, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{scorer.player}</p>
                      <p className="text-sm text-muted-foreground">{scorer.team}</p>
                    </div>
                    <span className="text-lg font-bold">{scorer.goals}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconTrophy className="w-5 h-5" />
                Team Records
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {statistics.teamStats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-sm text-muted-foreground">{stat.stat}</p>
                    <p className="font-medium">{stat.team}</p>
                    <p className="text-sm">{stat.value}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tournament Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="w-5 h-5" />
                Tournament Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Matches</p>
                    <p className="text-2xl font-bold">{statistics.tournamentStats.totalMatches}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Goals</p>
                    <p className="text-2xl font-bold">{statistics.tournamentStats.totalGoals}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Goals/Match</p>
                    <p className="text-2xl font-bold">{statistics.tournamentStats.averageGoals}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Clean Sheets</p>
                    <p className="text-2xl font-bold">{statistics.tournamentStats.cleanSheets}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
} 