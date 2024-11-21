"use client";

import { Team } from "@/types/team";
import { Season, Standing } from "@/types/season";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconTrophy, IconBallFootball, IconShieldCheck, IconSwords, IconTarget, IconHandStop } from "@tabler/icons-react";
import Link from "next/link";

interface StandingsSectionProps {
  season: Season;
  teams: Team[];
  standings: Standing[];
}

export function StandingsSection({ season, teams, standings }: StandingsSectionProps) {
  // Calculate total matches played
  const totalMatches = standings.reduce((sum, standing) => sum + standing.stats.played, 0) / 2;

  // Calculate total goals
  const totalGoals = standings.reduce((sum, standing) => sum + standing.stats.goalsFor, 0);

  // Find best attack (team with most goals)
  const bestAttack = standings.length > 0 ? standings.reduce((best, current) => 
    current.stats.goalsFor > best.stats.goalsFor ? current : best
  , standings[0]) : null;

  // Find best defense (team with least goals against)
  const bestDefense = standings.length > 0 ? standings.reduce((best, current) => 
    current.stats.goalsAgainst < best.stats.goalsAgainst ? current : best
  , standings[0]) : null;

  // Calculate top scorer
  const topScorer = teams.reduce((best: { name: string, goals: number } | null, team) => {
    const bestInTeam = team.members.reduce((topPlayer, player) => {
      if (!topPlayer || player.stats.goals > topPlayer.goals) {
        return { name: player.name, goals: player.stats.goals };
      }
      return topPlayer;
    }, null as { name: string, goals: number } | null);

    if (!best || (bestInTeam && bestInTeam.goals > best.goals)) {
      return bestInTeam;
    }
    return best;
  }, null);

  // Calculate top assister
  const topAssister = teams.reduce((best: { name: string, assists: number } | null, team) => {
    const bestInTeam = team.members.reduce((topPlayer, player) => {
      if (!topPlayer || player.stats.assists > topPlayer.assists) {
        return { name: player.name, assists: player.stats.assists };
      }
      return topPlayer;
    }, null as { name: string, assists: number } | null);

    if (!best || (bestInTeam && bestInTeam.assists > best.assists)) {
      return bestInTeam;
    }
    return best;
  }, null);

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Matches
            </CardTitle>
            <IconBallFootball className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalMatches}</div>
            <p className="text-xs text-muted-foreground">
              matches joués
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Buts
            </CardTitle>
            <IconTrophy className="h-4 w-4 text-muted-foreground" />
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
              Meilleure Attaque
            </CardTitle>
            <IconSwords className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bestAttack ? teams.find(t => t.id === bestAttack.stats.teamId)?.name : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {bestAttack ? `${bestAttack.stats.goalsFor} buts marqués` : "Aucun but"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Meilleure Défense
            </CardTitle>
            <IconShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bestDefense ? teams.find(t => t.id === bestDefense.stats.teamId)?.name : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {bestDefense ? `${bestDefense.stats.goalsAgainst} buts encaissés` : "Aucun but"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Standings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="w-5 h-5" />
            Classement - {season.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Pos</TableHead>
                <TableHead>Équipe</TableHead>
                <TableHead className="text-center">MJ</TableHead>
                <TableHead className="text-center">G</TableHead>
                <TableHead className="text-center">N</TableHead>
                <TableHead className="text-center">P</TableHead>
                <TableHead className="text-center">BP</TableHead>
                <TableHead className="text-center">BC</TableHead>
                <TableHead className="text-center">DB</TableHead>
                <TableHead className="text-center">Pts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {standings.map((standing: Standing, index: number) => (
                <TableRow key={standing.stats.teamId}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {teams.find(t => t.id === standing.stats.teamId)?.name}
                  </TableCell>
                  <TableCell className="text-center">{standing.stats.played}</TableCell>
                  <TableCell className="text-center">{standing.stats.won}</TableCell>
                  <TableCell className="text-center">{standing.stats.drawn}</TableCell>
                  <TableCell className="text-center">{standing.stats.lost}</TableCell>
                  <TableCell className="text-center">{standing.stats.goalsFor}</TableCell>
                  <TableCell className="text-center">{standing.stats.goalsAgainst}</TableCell>
                  <TableCell className="text-center">{standing.stats.goalDifference}</TableCell>
                  <TableCell className="text-center font-bold">{standing.stats.points}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Players Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href={`/standings/top-scorers`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Meilleur Buteur
              </CardTitle>
              <IconTarget className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {topScorer?.name || "Aucun"}
              </div>
              <p className="text-xs text-muted-foreground">
                {topScorer ? `${topScorer.goals} buts` : "Pas encore de buts"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Voir le classement complet →
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href={`/standings/top-assisters`}>
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Meilleur Passeur
              </CardTitle>
              <IconHandStop className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {topAssister?.name || "Aucun"}
              </div>
              <p className="text-xs text-muted-foreground">
                {topAssister ? `${topAssister.assists} passes décisives` : "Pas encore de passes décisives"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Voir le classement complet →
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
} 