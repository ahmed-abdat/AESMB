"use client";

import { useState } from "react";
import { Season, Round, Match, TeamStats, Standing } from "@/types/season";
import { Team } from "@/types/team";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { IconTrophy, IconEdit, IconRefresh } from "@tabler/icons-react";
import { MatchResultDialog } from "./MatchResultDialog";
import { calculateStandings } from "@/lib/standings";
import { resetMatchResult } from "@/app/actions/seasons";
import { toast } from "sonner";

interface SeasonStandingsProps {
  season: Season;
  teams: Team[];
  onUpdate: () => void;
}

export function SeasonStandings({ season, teams, onUpdate }: SeasonStandingsProps) {
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  const standings = calculateStandings(season, teams);

  const handleEditResult = (round: Round, match: Match) => {
    setSelectedRound(round);
    setSelectedMatch(match);
    setIsResultDialogOpen(true);
  };

  const handleResetResult = async (round: Round, match: Match) => {
    try {
      const result = await resetMatchResult(season.id, round.id, match.id);
      
      if (result.success) {
        toast.success("Résultat réinitialisé avec succès");
        onUpdate();
      } else {
        toast.error(result.error?.message || "Erreur lors de la réinitialisation du résultat");
      }
    } catch (error) {
      console.error("Error resetting match result:", error);
      toast.error("Erreur lors de la réinitialisation du résultat");
    }
  };

  return (
    <div className="space-y-8">
      {/* Standings Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconTrophy className="w-5 h-5" />
            Classement
          </CardTitle>
          <CardDescription>
            Classement actuel de la saison
          </CardDescription>
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

      {/* Match Results Section */}
      <Card>
        <CardHeader>
          <CardTitle>Résultats des Matches</CardTitle>
          <CardDescription>
            Gérez les résultats des matches par journée
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select
            onValueChange={(value) => {
              const round = season.rounds.find(r => r.id === value);
              setSelectedRound(round || null);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une journée" />
            </SelectTrigger>
            <SelectContent>
              {season.rounds
                .sort((a, b) => a.number - b.number)
                .map((round) => (
                  <SelectItem key={round.id} value={round.id}>
                    Journée {round.number}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          {selectedRound && (
            <div className="grid gap-4 md:grid-cols-2">
              {selectedRound.matches.map((match) => {
                const homeTeam = teams.find((t) => t.id === match.homeTeamId);
                const awayTeam = teams.find((t) => t.id === match.awayTeamId);

                return (
                  <Card key={match.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 text-center">
                          <p className="font-medium">{homeTeam?.name}</p>
                          <p className="text-2xl font-bold">
                            {match.result?.homeScore ?? "-"}
                          </p>
                        </div>
                        <div className="px-4">
                          <p className="text-sm text-muted-foreground">VS</p>
                        </div>
                        <div className="flex-1 text-center">
                          <p className="font-medium">{awayTeam?.name}</p>
                          <p className="text-2xl font-bold">
                            {match.result?.awayScore ?? "-"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditResult(selectedRound, match)}
                          >
                            <IconEdit className="w-4 h-4" />
                          </Button>
                          {match.result && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResetResult(selectedRound, match)}
                            >
                              <IconRefresh className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedRound && selectedMatch && (
        <MatchResultDialog
          seasonId={season.id}
          roundId={selectedRound.id}
          match={selectedMatch}
          homeTeam={teams.find(t => t.id === selectedMatch.homeTeamId)!}
          awayTeam={teams.find(t => t.id === selectedMatch.awayTeamId)!}
          open={isResultDialogOpen}
          onOpenChange={setIsResultDialogOpen}
          onSuccess={onUpdate}
        />
      )}
    </div>
  );
} 