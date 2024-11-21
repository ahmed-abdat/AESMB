"use client";

import { Team } from "@/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { IconTrophy, IconTarget, IconHandStop, IconSoccerField, IconChartBar } from "@tabler/icons-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface TeamDetailsSectionProps {
  team: Team;
}

export function TeamDetailsSection({ team }: TeamDetailsSectionProps) {
  // Sort players by goals scored
  const topScorers = [...team.members]
    .sort((a, b) => (b.stats.goals || 0) - (a.stats.goals || 0))
    .slice(0, 5);

  // Sort players by assists
  const topAssisters = [...team.members]
    .sort((a, b) => (b.stats.assists || 0) - (a.stats.assists || 0))
    .slice(0, 5);

  // Calculate total team offensive actions
  const teamStats = team.members.reduce(
    (acc, player) => ({
      totalGoals: acc.totalGoals + (player.stats.goals || 0),
      totalAssists: acc.totalAssists + (player.stats.assists || 0),
    }),
    { totalGoals: 0, totalAssists: 0 }
  );

  const teamTotalActions = teamStats.totalGoals + teamStats.totalAssists;

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Buts
            </CardTitle>
            <IconSoccerField className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalGoals}</div>
            <p className="text-xs text-muted-foreground">
              buts marqués par l&apos;équipe
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Assists
            </CardTitle>
            <IconHandStop className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teamStats.totalAssists}</div>
            <p className="text-xs text-muted-foreground">
              assists
            </p>
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
              Total = Buts + Assists | % Équipe = Pourcentage des actions offensives de l&apos;équipe
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rang</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead className="text-center">Buts</TableHead>
                <TableHead 
                  className="text-center"
                  title="Assists"
                >
                  Assists
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
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>{player.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{player.stats.goals || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{player.stats.assists || 0}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge>{totalContributions}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline">{contributionPercentage}%</Badge>
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