"use client";

import { motion } from "framer-motion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { clubs } from "@/types/tournament-data";

// Sample standings data - replace with real calculations later
const standings = [
  {
    team: "fc-char7e",
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
  },
  {
    team: "fc-madrid",
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
  },
  {
    team: "fc-ehil-dar",
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
  },
  {
    team: "caleptus",
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
  },
  {
    team: "pk-asc",
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
  },
].sort((a, b) => b.points - a.points || b.gd - a.gd);

interface StandingsTableProps {
  highlightedTeam?: string | null;
}

export function StandingsTable({ highlightedTeam }: StandingsTableProps) {
  return (
    <section className="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Classement du Championnat</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">#</TableHead>
                    <TableHead>Équipe</TableHead>
                    <TableHead className="text-center">MJ</TableHead>
                    <TableHead className="text-center">V</TableHead>
                    <TableHead className="text-center">N</TableHead>
                    <TableHead className="text-center">D</TableHead>
                    <TableHead className="text-center">BP</TableHead>
                    <TableHead className="text-center">BC</TableHead>
                    <TableHead className="text-center">DB</TableHead>
                    <TableHead className="text-center">Pts</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((team, index) => {
                    const teamData = clubs.find(
                      (club) => club.id === team.team
                    );
                    if (!teamData) return null;

                    return (
                      <TableRow 
                        key={team.team}
                        className={
                          highlightedTeam === team.team 
                            ? "bg-muted/50 transition-colors duration-300" 
                            : ""
                        }
                      >
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-medium">
                          {teamData.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {team.played}
                        </TableCell>
                        <TableCell className="text-center">
                          {team.won}
                        </TableCell>
                        <TableCell className="text-center">
                          {team.drawn}
                        </TableCell>
                        <TableCell className="text-center">
                          {team.lost}
                        </TableCell>
                        <TableCell className="text-center">{team.gf}</TableCell>
                        <TableCell className="text-center">{team.ga}</TableCell>
                        <TableCell className="text-center">{team.gd}</TableCell>
                        <TableCell className="text-center font-bold">
                          {team.points}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
      </motion.div>
    </section>
  );
}
