"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconCalendar, IconChevronDown } from "@tabler/icons-react";
import { MatchCard } from "@/components/matches/MatchCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { rounds } from "@/types/tournament-data";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SchedulePage() {
  const [selectedRound, setSelectedRound] = useState<number | null>(null);

  const filteredRounds = selectedRound
    ? rounds.filter((round) => round.id === selectedRound)
    : rounds;

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="w-full mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Calendrier des Matchs</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <IconCalendar className="w-4 h-4" />
                {selectedRound ? `Journée ${selectedRound}` : 'Sélectionner une journée'}
                <IconChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedRound(null)}>
                Toutes les journées
              </DropdownMenuItem>
              {rounds.map((round) => (
                <DropdownMenuItem
                  key={round.id}
                  onClick={() => setSelectedRound(round.id)}
                >
                  Journée {round.id}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-8"
        >
          {filteredRounds.map((round) => (
            <Card key={round.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Journée {round.id}</span>
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
                      matchTime={match.time}
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
