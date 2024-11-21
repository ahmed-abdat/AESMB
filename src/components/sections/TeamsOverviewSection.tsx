"use client";

import { Team } from "@/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconUsers, IconTrophy, IconBallFootball } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface TeamsOverviewSectionProps {
  teams: Team[];
}

export function TeamsOverviewSection({ teams }: TeamsOverviewSectionProps) {
  // Calculate total players
  const totalPlayers = teams.reduce((sum, team) => sum + team.members.length, 0);

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

  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <h2 className="text-2xl font-bold">Équipes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Link href={`/teams/${team.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={team.logo}
                          alt={team.name}
                          fill
                          sizes="(max-width: 64px) 100vw, 64px"
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{team.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <IconUsers className="w-4 h-4" />
                          <span>{team.members.length} joueurs</span>
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