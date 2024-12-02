'use client';

import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Team } from "@/types/team";

interface PlayerSearchProps {
  players: Array<{
    playerName: string;
    teamId: string;
    [key: string]: any;
  }>;
  teams: Team[];
  statKey: string;
  statLabel: string;
}

export function PlayerSearch({ players, teams, statKey, statLabel }: PlayerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter players based on search query
  const filteredPlayers = players.filter(player =>
    player.playerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Rechercher un joueur..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Pos</TableHead>
                <TableHead>Joueur</TableHead>
                <TableHead>Équipe</TableHead>
                <TableHead className="text-center">{statLabel}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlayers.map((player, index) => {
                const team = teams.find((t) => t.id === player.teamId);
                const originalPosition = players.findIndex(p => 
                  p.playerName === player.playerName && p.teamId === player.teamId
                ) + 1;

                return (
                  <TableRow 
                    key={`${player.playerName}-${player.teamId}`} 
                    className={originalPosition <= 3 ? "font-medium" : undefined}
                  >
                    <TableCell className={`font-medium ${originalPosition <= 3 ? "text-primary" : ""}`}>
                      {originalPosition}
                    </TableCell>
                    <TableCell>{player.playerName}</TableCell>
                    <TableCell>{team?.name || "Équipe inconnue"}</TableCell>
                    <TableCell className="text-center">{player[statKey]}</TableCell>
                  </TableRow>
                );
              })}
              {filteredPlayers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Aucun joueur trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 