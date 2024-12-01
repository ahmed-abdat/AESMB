"use client";

import { Match } from "@/types/season";
import { Team } from "@/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  IconCalendar,
  IconTarget,
  IconHandStop,
  IconArrowLeft,
  IconTargetOff,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface MatchDetailsSectionProps {
  match: Match & { roundNumber: number };
  teams: Team[];
}

function TeamLogo({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative w-16 h-16 md:w-24 md:h-24 mx-auto">
      <Image
        src={src || "/logo.jpg"}
        alt={alt}
        fill
        sizes="(max-width: 768px) 64px, 96px"
        className="object-contain"
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/logo.jpg";
        }}
      />
    </div>
  );
}

export function MatchDetailsSection({
  match,
  teams,
}: MatchDetailsSectionProps) {
  const router = useRouter();
  const homeTeam = teams.find((team) => team.id === match.homeTeamId);
  const awayTeam = teams.find((team) => team.id === match.awayTeamId);

  const homeGoals = match.result?.goals?.home || [];
  const awayGoals = match.result?.goals?.away || [];

  const renderGoal = (
    goal: any,
    team: Team | undefined,
    opposingTeam: Team | undefined
  ) => {
    if (goal.type === "own") {
      return (
        <li
          key={goal.id}
          className="flex flex-wrap items-center gap-2 text-sm sm:text-base"
        >
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-red-500/10">
            <IconTargetOff className="w-4 h-4 flex-shrink-0 text-red-500" />
            <span className="font-medium truncate text-red-600">
              But contre son camp
              <span className="text-red-500/80 text-sm ml-1">
                ({opposingTeam?.name})
              </span>
            </span>
          </div>
        </li>
      );
    }

    const scorer = team?.members.find((m) => m.id === goal.scorerId);
    const assister = goal.assistId
      ? team?.members.find((m) => m.id === goal.assistId)
      : null;

    return (
      <li
        key={goal.id}
        className="flex flex-wrap items-center gap-2 text-sm sm:text-base"
      >
        <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-green-500/10">
          <IconTarget className="w-4 h-4 flex-shrink-0 text-green-500" />
          <span className="font-medium truncate text-green-600">
            {scorer?.name}
          </span>
          {assister && (
            <>
              <IconHandStop className="w-4 h-4 flex-shrink-0 ml-2 text-green-500" />
              <span className="text-green-500/80 truncate">
                {assister.name}
              </span>
            </>
          )}
        </div>
      </li>
    );
  };

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
      {/* Back Button */}
      <Button
        variant="ghost"
        className="flex items-center gap-2 hover:bg-muted -ml-2"
        onClick={() => router.back()}
      >
        <IconArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Retour aux résultats</span>
        <span className="sm:hidden">Retour</span>
      </Button>

      {/* Match Result Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground justify-center">
              <IconCalendar className="w-4 h-4" />
              <span>
                {format(new Date(match.date), "d MMMM yyyy - HH:mm", {
                  locale: fr,
                })}
              </span>
            </div>

            <div className="grid grid-cols-3 items-center gap-4 sm:gap-8">
              <div className="text-center space-y-2 sm:space-y-4">
                <TeamLogo
                  src={homeTeam?.logo || ""}
                  alt={homeTeam?.name || ""}
                />
                <p className="text-sm sm:text-xl font-bold truncate px-2">
                  {homeTeam?.name}
                </p>
              </div>

              <div className="text-center">
                <div className="text-2xl sm:text-4xl font-bold">
                  {match.result?.homeScore} - {match.result?.awayScore}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Terminé
                </p>
              </div>

              <div className="text-center space-y-2 sm:space-y-4">
                <TeamLogo
                  src={awayTeam?.logo || ""}
                  alt={awayTeam?.name || ""}
                />
                <p className="text-sm sm:text-xl font-bold truncate px-2">
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
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <IconTarget className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">Buts {homeTeam?.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {homeGoals.length > 0 ? (
              <ul className="space-y-2">
                {homeGoals.map((goal) => renderGoal(goal, homeTeam, awayTeam))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun but</p>
            )}
          </CardContent>
        </Card>

        {/* Away Team Goals */}
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <IconTarget className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="truncate">Buts {awayTeam?.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            {awayGoals.length > 0 ? (
              <ul className="space-y-2">
                {awayGoals.map((goal) => renderGoal(goal, awayTeam, homeTeam))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun but</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
