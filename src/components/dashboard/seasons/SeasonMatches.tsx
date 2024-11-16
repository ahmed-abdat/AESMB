"use client";

import { useState } from "react";
import { Season, Round, Match } from "@/types/season";
import { Team } from "@/types/team";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconPlus,
  IconCalendar,
  IconSoccerField,
  IconEdit,
  IconTrash,
  IconDotsVertical,
} from "@tabler/icons-react";
import { AddRoundDialog } from "@/components/dashboard/seasons/AddRoundDialog";
import { AddMatchDialog } from "@/components/dashboard/seasons/AddMatchDialog";
import { EditMatchDialog } from "@/components/dashboard/seasons/EditMatchDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteMatch, deleteRound } from "@/app/actions/seasons";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SeasonMatchesProps {
  season: Season;
  teams: Team[];
  onUpdate: () => void;
}

export function SeasonMatches({ season, teams, onUpdate }: SeasonMatchesProps) {
  const [isAddRoundDialogOpen, setIsAddRoundDialogOpen] = useState(false);
  const [isAddMatchDialogOpen, setIsAddMatchDialogOpen] = useState(false);
  const [isEditMatchDialogOpen, setIsEditMatchDialogOpen] = useState(false);
  const [isDeleteMatchDialogOpen, setIsDeleteMatchDialogOpen] = useState(false);
  const [isDeleteRoundDialogOpen, setIsDeleteRoundDialogOpen] = useState(false);
  const [selectedRound, setSelectedRound] = useState<Round | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [selectedRoundForDelete, setSelectedRoundForDelete] = useState<Round | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMatch = (round: Round) => {
    setSelectedRound(round);
    setIsAddMatchDialogOpen(true);
  };

  const handleEditMatch = (round: Round, match: Match) => {
    setSelectedRound(round);
    setSelectedMatch(match);
    setIsEditMatchDialogOpen(true);
  };

  const handleDeleteMatch = (round: Round, match: Match) => {
    setSelectedRound(round);
    setSelectedMatch(match);
    setIsDeleteMatchDialogOpen(true);
  };

  const handleDeleteRound = (round: Round) => {
    setSelectedRoundForDelete(round);
    setIsDeleteRoundDialogOpen(true);
  };

  const confirmDeleteMatch = async () => {
    if (!selectedRound || !selectedMatch) return;

    setIsLoading(true);
    try {
      const result = await deleteMatch(season.id, selectedRound.id, selectedMatch.id);
      
      if (result.success) {
        toast.success("Match supprimé avec succès");
        onUpdate();
        setIsDeleteMatchDialogOpen(false);
      } else {
        toast.error(result.error?.message || "Erreur lors de la suppression du match");
      }
    } catch (error) {
      console.error("Error deleting match:", error);
      toast.error("Erreur lors de la suppression du match");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteRound = async () => {
    if (!selectedRoundForDelete) return;

    setIsLoading(true);
    try {
      const result = await deleteRound(season.id, selectedRoundForDelete.id);
      
      if (result.success) {
        toast.success("Journée supprimée avec succès");
        onUpdate();
        setIsDeleteRoundDialogOpen(false);
      } else {
        toast.error(result.error?.message || "Erreur lors de la suppression de la journée");
      }
    } catch (error) {
      console.error("Error deleting round:", error);
      toast.error("Erreur lors de la suppression de la journée");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to sort matches by date
  const sortMatches = (matches: Match[]) => {
    return [...matches].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Journées et Matches</h3>
          <p className="text-sm text-muted-foreground">
            Gérez les journées et les matches de la saison
          </p>
        </div>
        <Button onClick={() => setIsAddRoundDialogOpen(true)} className="gap-2">
          <IconPlus className="w-4 h-4" />
          Ajouter une journée
        </Button>
      </div>

      <div className="space-y-6">
        {season.rounds
          .sort((a, b) => a.number - b.number)
          .map((round) => (
            <Card key={round.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Journée {round.number}</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddMatch(round)}
                    className="gap-2"
                  >
                    <IconPlus className="w-4 h-4" />
                    Ajouter un match
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRound(round)}
                    className="h-8 w-8 p-0"
                  >
                    <IconTrash className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {sortMatches(round.matches).map((match) => {
                    const homeTeam = teams.find((t) => t.id === match.homeTeamId);
                    const awayTeam = teams.find((t) => t.id === match.awayTeamId);
                    const matchDate = new Date(match.date);

                    return (
                      <Card key={match.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2">
                                <IconCalendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                  {format(matchDate, "d MMMM yyyy - HH:mm", {
                                    locale: fr,
                                  })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <IconSoccerField className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                  {homeTeam?.name} vs {awayTeam?.name}
                                </span>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <IconDotsVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEditMatch(round, match)}
                                  className="gap-2"
                                >
                                  <IconEdit className="w-4 h-4" />
                                  Modifier
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteMatch(round, match)}
                                  className="gap-2 text-destructive"
                                >
                                  <IconTrash className="w-4 h-4" />
                                  Supprimer
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <AddRoundDialog
        seasonId={season.id}
        open={isAddRoundDialogOpen}
        onOpenChange={setIsAddRoundDialogOpen}
        onSuccess={onUpdate}
      />

      {selectedRound && (
        <>
          <AddMatchDialog
            seasonId={season.id}
            round={selectedRound}
            teams={teams}
            open={isAddMatchDialogOpen}
            onOpenChange={setIsAddMatchDialogOpen}
            onSuccess={onUpdate}
          />

          {selectedMatch && (
            <>
              <EditMatchDialog
                seasonId={season.id}
                round={selectedRound}
                match={selectedMatch}
                teams={teams}
                open={isEditMatchDialogOpen}
                onOpenChange={setIsEditMatchDialogOpen}
                onSuccess={onUpdate}
              />

              <ConfirmDialog
                open={isDeleteMatchDialogOpen}
                onOpenChange={setIsDeleteMatchDialogOpen}
                onConfirm={confirmDeleteMatch}
                title="Supprimer le match"
                description="Êtes-vous sûr de vouloir supprimer ce match ?"
                confirmText="Supprimer"
                variant="destructive"
                isLoading={isLoading}
              />
            </>
          )}
        </>
      )}

      {selectedRoundForDelete && (
        <ConfirmDialog
          open={isDeleteRoundDialogOpen}
          onOpenChange={setIsDeleteRoundDialogOpen}
          onConfirm={confirmDeleteRound}
          title="Supprimer la journée"
          description={
            <>
              <p>Êtes-vous sûr de vouloir supprimer la journée {selectedRoundForDelete.number} ?</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Cette action supprimera également tous les matches de cette journée.
              </p>
            </>
          }
          confirmText="Supprimer"
          variant="destructive"
          isLoading={isLoading}
        />
      )}
    </div>
  );
} 