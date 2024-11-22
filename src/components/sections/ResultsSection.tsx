"use client";

import { Season } from "@/types/season";
import { Team } from "@/types/team";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { IconCalendar, IconFilter } from "@tabler/icons-react";
import Image from "next/image";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ResultsSectionProps {
  season: Season;
  teams: Team[];
}

function TeamLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-12 h-12 mx-auto">
      <Image
        src={src || '/placeholder-team.png'}
        alt={alt}
        fill
        sizes="(max-width: 48px) 100vw, 48px"
        className="object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/placeholder-team.png';
        }}
      />
    </div>
  );
}

export function ResultsSection({ season, teams }: ResultsSectionProps) {
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedRound, setSelectedRound] = useState<string>("all");
  const router = useRouter();

  // Helper function to get team details
  const getTeam = (teamId: string) => {
    return teams.find((team) => team.id === teamId);
  };

  // Filter matches based on selection
  const filteredRounds = season.rounds
    .map(round => ({
      ...round,
      matches: round.matches.filter(match => {
        const matchesTeam = selectedTeam === "all" || 
          match.homeTeamId === selectedTeam || 
          match.awayTeamId === selectedTeam;
        const matchesRound = selectedRound === "all" || 
          round.number.toString() === selectedRound;
        const isCompleted = match.status === "completed";
        return matchesTeam && matchesRound && isCompleted;
      })
    }))
    .filter(round => round.matches.length > 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={selectedTeam}
          onValueChange={setSelectedTeam}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par équipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les équipes</SelectItem>
            {teams.map((team) => (
              <SelectItem key={team.id} value={team.id}>
                {team.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedRound}
          onValueChange={setSelectedRound}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par journée" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les journées</SelectItem>
            {season.rounds
              .sort((a, b) => a.number - b.number)
              .map((round) => (
                <SelectItem key={round.id} value={round.number.toString()}>
                  Journée {round.number}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => {
            setSelectedTeam("all");
            setSelectedRound("all");
          }}
        >
          <IconFilter className="w-4 h-4" />
          Réinitialiser
        </Button>
      </div>

      {/* Results */}
      <div className="space-y-8">
        {filteredRounds.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Aucun résultat trouvé
          </div>
        ) : (
          filteredRounds
            .sort((a, b) => b.number - a.number)
            .map((round) => (
              <div key={round.id} className="space-y-4">
                <h2 className="text-xl font-bold">Journée {round.number}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {round.matches
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((match) => {
                      const homeTeam = getTeam(match.homeTeamId);
                      const awayTeam = getTeam(match.awayTeamId);
                      const isHighlighted = selectedTeam !== "all" && 
                        (match.homeTeamId === selectedTeam || match.awayTeamId === selectedTeam);

                      return (
                        <Card 
                          key={match.id}
                          className={`${isHighlighted ? "border-primary" : ""} cursor-pointer hover:bg-muted/50 transition-colors`}
                          onClick={() => router.push(`/matches/${match.id}`)}
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col space-y-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <IconCalendar className="w-4 h-4" />
                                <span>
                                  {format(new Date(match.date), "d MMMM yyyy - HH:mm", {
                                    locale: fr,
                                  })}
                                </span>
                              </div>

                              <div className="grid grid-cols-3 items-center gap-4">
                                <div className="text-center space-y-2">
                                  <TeamLogo
                                    src={homeTeam?.logo || ""}
                                    alt={homeTeam?.name || ""}
                                  />
                                  <p className="text-sm font-medium">
                                    {homeTeam?.name}
                                  </p>
                                </div>

                                <div className="text-center">
                                  <div className="text-2xl font-bold">
                                    {match.result?.homeScore} - {match.result?.awayScore}
                                  </div>
                                  <Badge variant="secondary" className="mt-1">
                                    Terminé
                                  </Badge>
                                </div>

                                <div className="text-center space-y-2">
                                  <TeamLogo
                                    src={awayTeam?.logo || ""}
                                    alt={awayTeam?.name || ""}
                                  />
                                  <p className="text-sm font-medium">
                                    {awayTeam?.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
} 