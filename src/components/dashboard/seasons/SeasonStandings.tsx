"use client";

import { useState } from "react";
import { Season, Round, Match, Standing } from "@/types/season";
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
}

export function SeasonStandings({ season, teams }: SeasonStandingsProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [isResultDialogOpen, setIsResultDialogOpen] = useState(false);

  const standings = calculateStandings(season, teams);

  const handleEditResult = (match: Match) => {
    setSelectedMatch(match);
    setIsResultDialogOpen(true);
  };

  const handleResetResult = async (roundId: string, match: Match) => {
    try {
      const result = await resetMatchResult(season.id, roundId, match.id);
      
      if (result.success) {
        toast.success("Résultat réinitialisé avec succès");
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
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Résultats des Matches</h3>
        
        {season.rounds
          .sort((a, b) => a.number - b.number)
          .map((round) => (
            <Card key={round.id} id={`round-${round.number}`} className="scroll-mt-6">
              <CardHeader>
                <CardTitle>Journée {round.number}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {round.matches.map((match) => {
                    const homeTeam = teams.find((t) => t.id === match.homeTeamId);
                    const awayTeam = teams.find((t) => t.id === match.awayTeamId);

                    return (
                      <Card key={match.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 text-center">
                              <p className="font-medium">{homeTeam?.name}</p>
                              <p className="text-2xl font-bold">
                                {match.status === 'completed' ? match.result?.homeScore : "-"}
                              </p>
                            </div>
                            <div className="px-4">
                              <p className="text-sm text-muted-foreground">VS</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {match.status === 'completed' ? 'Terminé' : 
                                 match.status === 'cancelled' ? 'Annulé' : 'Programmé'}
                              </p>
                            </div>
                            <div className="flex-1 text-center">
                              <p className="font-medium">{awayTeam?.name}</p>
                              <p className="text-2xl font-bold">
                                {match.status === 'completed' ? match.result?.awayScore : "-"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditResult(match)}
                              >
                                <IconEdit className="w-4 h-4" />
                              </Button>
                              {match.status === 'completed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleResetResult(round.id, match)}
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
              </CardContent>
            </Card>
          ))}

        {/* Quick Navigation */}
        <div className="fixed bottom-6 right-6">
          <Select
            value=""
            onValueChange={(value) => {
              const element = document.getElementById(`round-${value}`);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Aller à la journée..." />
            </SelectTrigger>
            <SelectContent>
              {season.rounds
                .sort((a, b) => a.number - b.number)
                .map((round) => (
                  <SelectItem key={round.id} value={round.number.toString()}>
                    Journée {round.number}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedMatch && (
        <MatchResultDialog
          seasonId={season.id}
          roundId={season.rounds.find(r => 
            r.matches.some(m => m.id === selectedMatch.id)
          )?.id || ''}
          match={selectedMatch}
          homeTeam={teams.find(t => t.id === selectedMatch.homeTeamId)!}
          awayTeam={teams.find(t => t.id === selectedMatch.awayTeamId)!}
          open={isResultDialogOpen}
          onOpenChange={setIsResultDialogOpen}
        />
      )}
    </div>
  );
} 