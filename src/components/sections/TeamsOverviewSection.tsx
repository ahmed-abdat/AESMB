"use client";

import { Team } from "@/types/team";
import { Season, Standing } from "@/types/season";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconUsers, IconTrophy, IconBallFootball, IconTarget, IconMedal } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TeamsOverviewSectionProps {
  teams: Team[];
  currentSeason?: Season;
  standings: Standing[];
  participatingTeams: Team[];
}

export function TeamsOverviewSection({ 
  teams, 
  currentSeason, 
  standings = [], 
  participatingTeams = [] 
}: TeamsOverviewSectionProps) {
  // Calculate total players for participating teams only
  const totalPlayers = participatingTeams.reduce((sum, team) => sum + team.members.length, 0);

  // Calculate total goals including own goals for participating teams only
  const totalGoals = participatingTeams.reduce((sum, team) => {
    // Regular goals from player stats
    const regularGoals = team.members.reduce(
      (teamSum, player) => teamSum + (player.stats.goals || 0), 
      0
    );

    // Own goals from matches (both for and against)
    let ownGoalsForTeam = 0;
    if (currentSeason) {
      currentSeason.rounds.forEach(round => {
        round.matches.forEach(match => {
          if (match.result) {
            if (match.homeTeamId === team.id) {
              match.result.goals.away.forEach(goal => {
                if (goal.type === 'own') ownGoalsForTeam++;
              });
            } else if (match.awayTeamId === team.id) {
              match.result.goals.home.forEach(goal => {
                if (goal.type === 'own') ownGoalsForTeam++;
              });
            }
          }
        });
      });
    }

    return sum + regularGoals + ownGoalsForTeam;
  }, 0);

  // Find top scorer from participating teams only
  const topScorer = participatingTeams.reduce((best: { name: string, team: string, goals: number } | null, team) => {
    const teamBest = team.members.reduce((topPlayer, player) => {
      if (!topPlayer || player.stats.goals > topPlayer.goals) {
        return { name: player.name, team: team.name, goals: player.stats.goals };
      }
      return topPlayer;
    }, null as { name: string, team: string, goals: number } | null);

    if (!best || (teamBest && teamBest.goals > best.goals)) {
      return teamBest;
    }
    return best;
  }, null);

  // Sort participating teams by standings and goals
  const sortedParticipatingTeams = [...participatingTeams].sort((a, b) => {
    const aStanding = standings?.find(s => s.stats.teamId === a.id);
    const bStanding = standings?.find(s => s.stats.teamId === b.id);

    if (aStanding && bStanding) {
      if (aStanding.stats.points === bStanding.stats.points) {
        return bStanding.stats.goalDifference - aStanding.stats.goalDifference;
      }
      return bStanding.stats.points - aStanding.stats.points;
    }
    return 0;
  });

  // Get and sort non-participating teams
  const nonParticipatingTeams = teams
    .filter(team => !participatingTeams.some(pt => pt.id === team.id))
    .sort((a, b) => {
      const aGoals = a.members.reduce((sum, player) => sum + (player.stats.goals || 0), 0);
      const bGoals = b.members.reduce((sum, player) => sum + (player.stats.goals || 0), 0);
      return bGoals - aGoals;
    });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Équipes
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{participatingTeams.length}</div>
            <p className="text-xs text-muted-foreground">
              équipes cette saison
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Joueurs
            </CardTitle>
            <IconBallFootball className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{totalPlayers}</div>
            <p className="text-xs text-muted-foreground">
              joueurs inscrits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Buts
            </CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              buts marqués (incluant CSC)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Meilleur Buteur
            </CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold truncate">
              {topScorer?.name || "Aucun"}
            </div>
            <p className="text-xs text-muted-foreground truncate">
              {topScorer ? `${topScorer.goals} buts - ${topScorer.team}` : "Pas encore de buts"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current Season Teams */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-xl sm:text-2xl font-bold">
            Équipes {currentSeason?.name}
          </h2>
          <span className="text-sm text-muted-foreground">
            Trié par classement et buts
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {sortedParticipatingTeams.map((team, index) => {
            const standing = standings?.find(s => s.stats.teamId === team.id);
            const totalGoals = team.members.reduce((sum, player) => sum + (player.stats.goals || 0), 0);

            return (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link href={`/teams/${team.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors border-primary/50">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                          <Image
                            src={team.logo}
                            alt={team.name}
                            fill
                            sizes="(max-width: 768px) 48px, 64px"
                            className="object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/logo.jpg';
                            }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className={cn(
                              "font-semibold truncate text-base sm:text-lg",
                              index === 0 && "text-yellow-600",
                              index === 1 && "text-gray-600",
                              index === 2 && "text-amber-700"
                            )}>
                              {team.name}
                            </h3>
                            {index < 3 && (
                              <Badge 
                                className={cn(
                                  "ml-auto sm:ml-2 text-xs sm:text-sm",
                                  index === 0 && "bg-yellow-500/10 text-yellow-600 border-yellow-500/50",
                                  index === 1 && "bg-gray-300/20 text-gray-600 border-gray-400/50",
                                  index === 2 && "bg-amber-600/10 text-amber-700 border-amber-600/50"
                                )}
                              >
                                {index === 0 && "🥇 1er"}
                                {index === 1 && "🥈 2ème"}
                                {index === 2 && "🥉 3ème"}
                              </Badge>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 mt-2">
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <IconUsers className="w-4 h-4" />
                              <span>{team.members.length}</span>
                            </div>
                            {standing ? (
                              <>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                  <IconTrophy className="w-4 h-4" />
                                  <span>{standing.stats.points}pts</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                  <IconTarget className="w-4 h-4" />
                                  <span>{standing.stats.goalsFor}</span>
                                </div>
                              </>
                            ) : (
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <IconTarget className="w-4 h-4" />
                                <span>{totalGoals}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        {standing && (
                          <div className="hidden sm:flex flex-col items-end justify-between h-full">
                            <Badge 
                              className={cn(
                                "font-bold text-lg",
                                index === 0 && "bg-yellow-500/10 text-yellow-600 border-yellow-500/50",
                                index === 1 && "bg-gray-300/20 text-gray-600 border-gray-400/50",
                                index === 2 && "bg-amber-600/10 text-amber-700 border-amber-600/50"
                              )}
                            >
                              #{index + 1}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Other Teams */}
      {nonParticipatingTeams.length > 0 && (
        <div className="space-y-4 mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-muted-foreground">
              Autres Équipes
            </h2>
            <span className="text-sm text-muted-foreground">
              Trié par nombre de buts
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {nonParticipatingTeams.map((team, index) => {
              const totalGoals = team.members.reduce((sum, player) => sum + (player.stats.goals || 0), 0);

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link href={`/teams/${team.id}`}>
                    <Card className="hover:bg-muted/50 transition-colors opacity-75 hover:opacity-100">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0">
                            <Image
                              src={team.logo}
                              alt={team.name}
                              fill
                              sizes="(max-width: 768px) 48px, 64px"
                              className="object-contain"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/logo.jpg';
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate text-base sm:text-lg">{team.name}</h3>
                            </div>
                            <div className="flex flex-wrap gap-3 mt-2">
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <IconUsers className="w-4 h-4" />
                                <span>{team.members.length}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <IconTarget className="w-4 h-4" />
                                <span>{totalGoals}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 