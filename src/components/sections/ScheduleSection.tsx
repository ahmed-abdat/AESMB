"use client";

import { motion } from "framer-motion";
import { MatchCard } from "../matches/MatchCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeasonFirestore } from "@/types/season";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconCalendarEvent } from "@tabler/icons-react";

interface ScheduleSectionProps {
  season: SeasonFirestore & { id: string };
}

export function ScheduleSection({ season }: ScheduleSectionProps) {
  const [selectedRoundNumber, setSelectedRoundNumber] = useState<string>('all');
  
  // Sort rounds by number
  const sortedRounds = [...season.rounds].sort((a, b) => a.number - b.number);

  // Filter rounds based on selection
  const displayedRounds = selectedRoundNumber === 'all' 
    ? sortedRounds 
    : sortedRounds.filter(round => round.number === parseInt(selectedRoundNumber));

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3 md:py-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base">
            <IconCalendarEvent className="h-4 w-4 md:h-5 md:w-5" />
            <span>Filtrer par journée</span>
          </div>
          <Select
            value={selectedRoundNumber}
            onValueChange={setSelectedRoundNumber}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Sélectionner une journée" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les journées</SelectItem>
              {sortedRounds.map((round) => (
                <SelectItem key={round.id} value={round.number.toString()}>
                  Journée {round.number}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4 md:space-y-6"
      >
        {displayedRounds.map((round) => (
          <Card key={round.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 py-3 md:py-4">
              <CardTitle className="flex justify-between items-center text-base md:text-lg">
                <span>Journée {round.number}</span>
                <span className="text-xs md:text-sm text-muted-foreground font-normal">
                  {round.matches.length} match{round.matches.length > 1 ? 'es' : ''}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {round.matches
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((match) => (
                    <MatchCard
                      key={match.id}
                      homeTeamId={match.homeTeamId}
                      awayTeamId={match.awayTeamId}
                      matchDate={new Date(match.date)}
                      status={match.status}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {displayedRounds.length === 0 && (
        <div className="text-center py-8 md:py-12 text-sm md:text-base text-muted-foreground">
          Aucun match trouvé pour cette journée
        </div>
      )}
    </div>
  );
} 