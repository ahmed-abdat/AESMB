"use client";

import { Team } from "@/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconUsers, IconTrophy, IconBallFootball, IconTarget } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface TeamsOverviewSectionProps {
  teams: Team[];
}

export function TeamsOverviewSection({ teams }: TeamsOverviewSectionProps) {
  // Calculate total players
  const totalPlayers = teams.reduce((sum, team) => sum + team.members.length, 0);

  // Calculate total goals for all teams
  const totalGoals = teams.reduce((sum, team) => 
    sum + team.members.reduce((teamSum, player) => teamSum + player.stats.goals, 0), 
  0);

  // Find top scorer
  const topScorer = teams.reduce((best: { name: string, team: string, goals: number } | null, team) => {
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

  // Calculate and sort teams by goals
  const teamsWithGoals = teams
    .map(team => ({
      ...team,
      totalGoals: team.members.reduce((sum, player) => sum + player.stats.goals, 0)
    }))
    .sort((a, b) => b.totalGoals - a.totalGoals); // Sort by total goals in descending order

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Équipes
            </CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teams.length}</div>
            <p className="text-xs text-muted-foreground">
              équipes inscrites
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Joueurs
            </CardTitle>
            <IconBallFootball className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPlayers}</div>
            <p className="text-xs text-muted-foreground">
              joueurs inscrits
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Buts
            </CardTitle>
            <IconTarget className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              buts marqués
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Meilleur Buteur
            </CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {topScorer?.name || "Aucun"}
            </div>
            <p className="text-xs text-muted-foreground">
              {topScorer ? `${topScorer.goals} buts - ${topScorer.team}` : "Pas encore de buts"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Teams Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Équipes</h2>
          <span className="text-sm text-muted-foreground">
            Trié par nombre de buts
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamsWithGoals.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link href={`/teams/${team.id}`}>
                <Card className={`hover:bg-muted/50 transition-colors ${index === 0 ? 'border-primary' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={team.logo}
                          alt={team.name}
                          fill
                          sizes="(max-width: 64px) 100vw, 64px"
                          className="object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/logo.jpg';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{team.name}</h3>
                          {index === 0 && (
                            <IconTrophy className="w-4 h-4 text-primary" />
                          )}
                        </div>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconUsers className="w-4 h-4" />
                            <span>{team.members.length} joueurs</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <IconTarget className="w-4 h-4" />
                            <span className={index === 0 ? 'text-primary font-medium' : ''}>
                              {team.totalGoals} buts
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 