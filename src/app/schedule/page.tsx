"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconCalendar } from "@tabler/icons-react";
import { MatchCard } from "@/components/matches/MatchCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rounds } from "@/types/tournament-data";

export default function SchedulePage() {
  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Match Schedule</h1>
          <Button variant="outline" className="gap-2">
            <IconCalendar className="w-4 h-4" />
            Select Round
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {rounds.map((round) => (
            <Card key={round.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Round {round.id}</span>
                  <span className="text-muted-foreground text-sm">
                    {round.date}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {round.matches.map((match, matchIndex) => (
                    <MatchCard
                      key={matchIndex}
                      homeTeam={match.homeTeam}
                      awayTeam={match.awayTeam}
                      matchDate={round.date}
                      matchTime="20:00"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
