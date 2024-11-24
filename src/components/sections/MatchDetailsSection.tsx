"use client";

import { Match } from "@/types/season";
import { Team } from "@/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { IconCalendar, IconTarget, IconHandStop, IconArrowLeft } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface MatchDetailsSectionProps {
  match: Match & { roundNumber: number };
  teams: Team[];
}

function TeamLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-24 h-24 mx-auto">
      <Image
        src={src || '/logo.jpg'}
        alt={alt}
        fill
        sizes="(max-width: 96px) 100vw, 96px"
        className="object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/logo.jpg';
        }}
      />
    </div>
  );
}

export function MatchDetailsSection({ match, teams }: MatchDetailsSectionProps) {
  const router = useRouter();
  const homeTeam = teams.find(team => team.id === match.homeTeamId);
  const awayTeam = teams.find(team => team.id === match.awayTeamId);

  const homeGoals = match.result?.goals?.home || [];
  const awayGoals = match.result?.goals?.away || [];

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 hover:bg-muted"
        onClick={() => router.back()}
      >
        <IconArrowLeft className="w-4 h-4" />
        Retour aux résultats
      </Button>

      {/* Match Result Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground justify-center">
              <IconCalendar className="w-4 h-4" />
              <span>
                {format(new Date(match.date), "d MMMM yyyy - HH:mm", {
                  locale: fr,
                })}
              </span>
            </div>

            <div className="grid grid-cols-3 items-center gap-8">
              <div className="text-center space-y-4">
                <TeamLogo
                  src={homeTeam?.logo || ""}
                  alt={homeTeam?.name || ""}
                />
                <p className="text-xl font-bold">
                  {homeTeam?.name}
                </p>
              </div>

              <div className="text-center">
                <div className="text-4xl font-bold">
                  {match.result?.homeScore} - {match.result?.awayScore}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Terminé
                </p>
              </div>

              <div className="text-center space-y-4">
                <TeamLogo
                  src={awayTeam?.logo || ""}
                  alt={awayTeam?.name || ""}
                />
                <p className="text-xl font-bold">
                  {awayTeam?.name}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Home Team Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <IconTarget className="w-5 h-5" />
              Buts {homeTeam?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {homeGoals.length > 0 ? (
              <ul className="space-y-2">
                {homeGoals.map((goal) => {
                  const scorer = homeTeam?.members.find(m => m.id === goal.scorerId);
                  const assister = goal.assistId ? 
                    homeTeam?.members.find(m => m.id === goal.assistId) : null;
                  
                  return (
                    <li key={goal.id} className="flex items-center gap-2">
                      <IconTarget className="w-4 h-4" />
                      <span className="font-medium">{scorer?.name}</span>
                      {assister && (
                        <>
                          <IconHandStop className="w-4 h-4 ml-2" />
                          <span className="text-muted-foreground">{assister.name}</span>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground">Aucun but</p>
            )}
          </CardContent>
        </Card>

        {/* Away Team Goals */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <IconTarget className="w-5 h-5" />
              Buts {awayTeam?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {awayGoals.length > 0 ? (
              <ul className="space-y-2">
                {awayGoals.map((goal) => {
                  const scorer = awayTeam?.members.find(m => m.id === goal.scorerId);
                  const assister = goal.assistId ? 
                    awayTeam?.members.find(m => m.id === goal.assistId) : null;
                  
                  return (
                    <li key={goal.id} className="flex items-center gap-2">
                      <IconTarget className="w-4 h-4" />
                      <span className="font-medium">{scorer?.name}</span>
                      {assister && (
                        <>
                          <IconHandStop className="w-4 h-4 ml-2" />
                          <span className="text-muted-foreground">{assister.name}</span>
                        </>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-muted-foreground">Aucun but</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 