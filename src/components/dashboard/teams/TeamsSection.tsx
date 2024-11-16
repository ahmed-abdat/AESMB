"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCalendarStats,
} from "@tabler/icons-react";
import { Team } from "@/types/team";
import { AddTeamDialog } from "./AddTeamDialog";
import { EditTeamDialog } from "./EditTeamDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteTeam } from "@/app/actions/teams";
import { toast } from "sonner";
import Image from "next/image";
import { TeamActionError } from "@/types/errors";
import Link from "next/link";

interface TeamsSectionProps {
  teams: Team[];
  onUpdate: () => void;
}

export function TeamsSection({ teams, onUpdate }: TeamsSectionProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (team: Team) => {
    if (team.seasons.length > 0) {
      toast.error(
        "Cette équipe ne peut pas être supprimée car elle participe à une ou plusieurs saisons"
      );
      return;
    }
    setSelectedTeam(team);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (team: Team) => {
    setSelectedTeam(team);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedTeam) return;

    setIsLoading(true);
    try {
      const result = await deleteTeam(selectedTeam.id);
      
      if (result.success) {
        toast.success("Équipe supprimée avec succès");
        onUpdate();
        setIsDeleteDialogOpen(false);
      } else if (result.error) {
        if (result.error.code === 'team_in_use') {
          toast.error("Cette équipe ne peut pas être supprimée car elle participe à une ou plusieurs saisons");
        } else {
          toast.error(result.error.message);
        }
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Erreur lors de la suppression de l'équipe");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Équipes</h2>
          <p className="text-muted-foreground">
            Gérez les équipes du championnat
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <IconPlus className="w-4 h-4" />
          Ajouter une équipe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {teams.map((team) => (
            <motion.div
              key={team.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/dashboard/teams/${team.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        <Image
                          src={team.logo}
                          alt={team.name}
                          fill
                          sizes="(max-width: 40px) 100vw, 40px"
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <span>{team.name}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IconCalendarStats className="w-4 h-4" />
                        <span>{team.seasons.length} saisons</span>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent navigation
                            handleEdit(team);
                          }}
                        >
                          <IconEdit className="w-4 h-4" />
                          Modifier
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-2"
                          onClick={(e) => {
                            e.preventDefault(); // Prevent navigation
                            handleDelete(team);
                          }}
                        >
                          <IconTrash className="w-4 h-4" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AddTeamDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={onUpdate}
      />

      {selectedTeam && (
        <>
          <EditTeamDialog
            team={selectedTeam}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={onUpdate}
          />

          <ConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={confirmDelete}
            title="Supprimer l'équipe"
            description={
              <>
                <p>Êtes-vous sûr de vouloir supprimer l'équipe "{selectedTeam.name}" ?</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Cette action est irréversible et supprimera également le logo de l'équipe.
                </p>
              </>
            }
            confirmText="Supprimer"
            variant="destructive"
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
} 