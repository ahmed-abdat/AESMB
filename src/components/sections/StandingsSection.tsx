"use client";

import { motion } from "framer-motion";
import { StandingsTable } from "./StandingsTable";
import { StatsCards } from "./StatsCards";
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
import { IconTrophy } from "@tabler/icons-react";

interface StandingsSectionProps {
  season: Season;
  teams: Team[];
  standings: Standing[];
}

export function StandingsSection({ season, teams, standings }: StandingsSectionProps) {
  return (
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
  );
} 