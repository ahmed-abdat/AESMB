"use client";

import { Season } from "@/types/season";
import { Team } from "@/types/team";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { IconCalendar } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

interface ScheduleSectionProps {
  season: Season;
  teams: Team[];
}

function TeamLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-12 h-12 mx-auto">
      <Image
        src={src || '/logo.jpg'}
        alt={alt}
        fill
        sizes="(max-width: 48px) 100vw, 48px"
        className="object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/logo.jpg';
        }}
      />
    </div>
  );
}

export function ScheduleSection({ season, teams }: ScheduleSectionProps) {
  // Helper function to get team name
  const getTeamName = (teamId: string) => {
    return teams.find((team) => team.id === teamId)?.name || "Équipe inconnue";
  };

  // Helper function to get team logo
  const getTeamLogo = (teamId: string) => {
    return teams.find((team) => team.id === teamId)?.logo || "";
  };

  return (
    <div className="space-y-8">
      {season.rounds
        .sort((a, b) => a.number - b.number)
        .map((round) => (
          <div key={round.id} className="space-y-4">
            <h2 className="text-xl font-bold">Journée {round.number}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {round.matches
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((match) => (
                  <Link key={match.id} href={`/matches/${match.id}`}>
                    <Card className="hover:bg-muted/50 transition-colors">
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
                                src={getTeamLogo(match.homeTeamId)}
                                alt={getTeamName(match.homeTeamId)}
                              />
                              <p className="text-sm font-medium">
                                {getTeamName(match.homeTeamId)}
                              </p>
                            </div>

                            <div className="text-center">
                              <div className="text-2xl font-bold">
                                {match.status === "completed"
                                  ? `${match.result?.homeScore} - ${match.result?.awayScore}`
                                  : "vs"}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {match.status === "completed"
                                  ? "Terminé"
                                  : match.status === "cancelled"
                                  ? "Annulé"
                                  : "À venir"}
                              </p>
                            </div>

                            <div className="text-center space-y-2">
                              <TeamLogo 
                                src={getTeamLogo(match.awayTeamId)}
                                alt={getTeamName(match.awayTeamId)}
                              />
                              <p className="text-sm font-medium">
                                {getTeamName(match.awayTeamId)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
            </div>
          </div>
        ))}
    </div>
  );
} 