"use client";

import { Team } from "@/types/team";
import { Season } from "@/types/season";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
  IconTarget,
  IconHandStop,
  IconSoccerField,
  IconTargetOff,
} from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TeamDetailsSectionProps {
  team: Team;
  seasons: Season[];
}

export function TeamDetailsSection({ team, seasons }: TeamDetailsSectionProps) {
  // Sort players by goals scored
  const topScorers = [...team.members]
    .sort((a, b) => (b.stats.goals || 0) - (a.stats.goals || 0))
    .slice(0, 5);

  // Sort players by assists
  const topAssisters = [...team.members]
    .sort((a, b) => (b.stats.assists || 0) - (a.stats.assists || 0))
    .slice(0, 5);

  // Calculate own goals from match data
  const ownGoals = {
    forTeam: 0, // Own goals scored by opponents (counts for our team)
    againstTeam: 0, // Own goals scored by our team (counts against us)
  };

  // Get all matches for this team from all seasons
  const teamMatches = seasons.flatMap((season) =>
    season.rounds.flatMap((round) =>
      round.matches.filter(
        (match) => match.homeTeamId === team.id || match.awayTeamId === team.id
      )
    )
  );

  // Calculate own goals from matches
  teamMatches.forEach((match) => {
    if (match.result) {
      if (match.homeTeamId === team.id) {
        // We're home team
        match.result.goals.away.forEach((goal) => {
          if (goal.type === "own") {
            ownGoals.forTeam++; // Own goal by away team counts for us
          }
        });
        match.result.goals.home.forEach((goal) => {
          if (goal.type === "own") {
            ownGoals.againstTeam++; // Own goal by us counts against us
          }
        });
      } else {
        // We're away team
        match.result.goals.home.forEach((goal) => {
          if (goal.type === "own") {
            ownGoals.forTeam++; // Own goal by home team counts for us
          }
        });
        match.result.goals.away.forEach((goal) => {
          if (goal.type === "own") {
            ownGoals.againstTeam++; // Own goal by us counts against us
          }
        });
      }
    }
  });

  // Calculate total goals from matches
  let totalMatchGoals = 0;
  teamMatches.forEach((match) => {
    if (match.result) {
      if (match.homeTeamId === team.id) {
        // When we're home team
        totalMatchGoals += match.result.homeScore; // All goals we scored as home team
      } else if (match.awayTeamId === team.id) {
        // When we're away team
        totalMatchGoals += match.result.awayScore; // All goals we scored as away team
      }
    }
  });

  // Calculate total team offensive actions
  const teamStats = {
    totalGoals: team.members.reduce(
      (acc, player) => acc + (player.stats.goals || 0),
      0
    ),
    totalAssists: team.members.reduce(
      (acc, player) => acc + (player.stats.assists || 0),
      0
    ),
  };

  const teamTotalActions = teamStats.totalGoals + teamStats.totalAssists;

  // Use totalMatchGoals instead of calculating from player stats + own goals
  const totalGoalsIncludingOwn = totalMatchGoals;

  return (
    <div className="space-y-8">
      {/* Team Header */}
      <div className="flex items-center gap-6">
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          <Image
            src={team.logo}
            alt={team.name}
            fill
            sizes="(max-width: 128px) 100vw, 128px"
            className="object-contain"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold">{team.name}</h1>
          <p className="text-muted-foreground">
            {team.members.length} joueurs inscrits
          </p>
        </div>
      </div>

      {/* Team Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Buts</CardTitle>
            <IconSoccerField className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalGoalsIncludingOwn}
              {ownGoals.forTeam > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({teamStats.totalGoals} + {ownGoals.forTeam} CSC)
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              buts marqués par l&apos;équipe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Assists</CardTitle>
            <IconHandStop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalAssists}</div>
            <p className="text-xs text-muted-foreground">assists</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Buts Contre Son Camp
            </CardTitle>
            <IconTargetOff className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col">
              <div className="text-2xl font-bold text-red-600">
                {ownGoals.againstTeam}
              </div>
              <p className="text-xs text-muted-foreground">
                buts contre son camp
              </p>
              {ownGoals.forTeam > 0 && (
                <div className="mt-2 text-sm text-green-600">
                  +{ownGoals.forTeam} en faveur
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Meilleur Buteur
            </CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topScorers[0]?.name || "Aucun"}
            </div>
            <p className="text-xs text-muted-foreground">
              {topScorers[0]
                ? `${topScorers[0].stats.goals} buts`
                : "Pas encore de buts"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Meilleur Passeur
            </CardTitle>
            <IconHandStop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topAssisters[0]?.name || "Aucun"}
            </div>
            <p className="text-xs text-muted-foreground">
              {topAssisters[0]
                ? `${topAssisters[0].stats.assists} assists`
                : "Pas encore d'assists"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Players Table */}
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle>Statistiques des Joueurs</CardTitle>
            <p className="text-sm text-muted-foreground">
              Total = Buts + Assists | % Équipe = Pourcentage des actions
              offensives de l&apos;équipe
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rang</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center justify-center gap-2">
                          <IconTarget className="w-4 h-4 text-primary" />
                          <span>Buts</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nombre de buts marqués</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="text-center">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center justify-center gap-2">
                          <IconHandStop className="w-4 h-4 text-indigo-500" />
                          <span>Assists</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Nombre de passes décisives</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableHead>
                <TableHead className="text-center" title="Buts + Assists">Total</TableHead>
                <TableHead 
                  className="text-center" 
                  title="Pourcentage des actions offensives de l'équipe"
                >
                  % Équipe
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {team.members
                .sort((a, b) => {
                  const totalA = (a.stats.goals || 0) + (a.stats.assists || 0);
                  const totalB = (b.stats.goals || 0) + (b.stats.assists || 0);
                  return totalB - totalA;
                })
                .map((player, index) => {
                  const totalContributions = (player.stats.goals || 0) + (player.stats.assists || 0);
                  const contributionPercentage = teamTotalActions > 0 
                    ? ((totalContributions / teamTotalActions) * 100).toFixed(1)
                    : "0";

                  return (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">
                        {index + 1}
                        {index < 3 && (
                          <span className="ml-1">
                            {index === 0 && "🥇"}
                            {index === 1 && "🥈"}
                            {index === 2 && "🥉"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Badge 
                            variant="secondary" 
                            className={cn(
                              "font-bold min-w-[2.5rem] flex items-center justify-center px-2 py-0.5",
                              player.stats.goals > 0 && "bg-primary/10 text-primary hover:bg-primary/20"
                            )}
                          >
                            {player.stats.goals || 0}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Badge 
                            variant="secondary"
                            className={cn(
                              "font-bold min-w-[2.5rem] flex items-center justify-center px-2 py-0.5",
                              player.stats.assists > 0 && "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20"
                            )}
                          >
                            {player.stats.assists || 0}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Badge 
                            className={cn(
                              "font-bold min-w-[2.5rem] flex items-center justify-center px-2 py-0.5",
                              totalContributions > 0 && "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                            )}
                          >
                            {totalContributions}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "font-bold min-w-[3rem] flex items-center justify-center px-2 py-0.5",
                              totalContributions > 0 && "border-green-500/50 text-green-600"
                            )}
                          >
                            {contributionPercentage}%
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
