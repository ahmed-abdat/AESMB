"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Standing } from "@/types/season";
import { Team } from "@/types/team";

interface StandingsTableProps {
  standings: Standing[];
  teams: Team[];
}

export function StandingsTable({ standings, teams }: StandingsTableProps) {
  return (
    <div className="rounded-md border">
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
          {standings.map((standing) => {
            const team = teams.find((t) => t.id === standing.stats.teamId);
            return (
              <TableRow key={standing.stats.teamId}>
                <TableCell className="font-medium">
                  {standing.position}
                </TableCell>
                <TableCell className="font-medium">{team?.name}</TableCell>
                <TableCell className="text-center">
                  {standing.stats.played}
                </TableCell>
                <TableCell className="text-center">{standing.stats.won}</TableCell>
                <TableCell className="text-center">
                  {standing.stats.drawn}
                </TableCell>
                <TableCell className="text-center">
                  {standing.stats.lost}
                </TableCell>
                <TableCell className="text-center">
                  {standing.stats.goalsFor}
                </TableCell>
                <TableCell className="text-center">
                  {standing.stats.goalsAgainst}
                </TableCell>
                <TableCell className="text-center">
                  {standing.stats.goalDifference}
                </TableCell>
                <TableCell className="text-center font-bold">
                  {standing.stats.points}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
