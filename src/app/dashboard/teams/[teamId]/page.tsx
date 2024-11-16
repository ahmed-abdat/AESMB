"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Team } from "@/types/team";
import { LoadingScreen } from "@/components/LoadingScreen";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { IconUserPlus, IconEdit, IconTrash, IconDotsVertical } from "@tabler/icons-react";
import { AddTeamMemberDialog } from "@/components/dashboard/teams/AddTeamMemberDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTeam } from "@/app/actions/teams";
import { EditTeamMemberDialog } from "@/components/dashboard/teams/EditTeamMemberDialog";
import { deleteTeamMember } from "@/app/actions/teams";
import { TeamMember } from "@/types/team";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TeamDetailsPage() {
  const params = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTeam = async () => {
    try {
      const result = await getTeam(params.teamId as string);
      if (result.success && result.team) {
        setTeam(result.team);
      } else {
        toast.error(result.error?.message || "Erreur lors du chargement de l'équipe");
      }
    } catch (error) {
      console.error("Error fetching team:", error);
      toast.error("Erreur lors du chargement de l'équipe");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.teamId) {
      fetchTeam();
    }
  }, [params.teamId]);

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditMemberDialogOpen(true);
  };

  const handleDeleteMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteMemberDialogOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!team || !selectedMember) return;

    setIsLoading(true);
    try {
      const result = await deleteTeamMember(team.id, selectedMember.id);
      
      if (result.success) {
        toast.success("Joueur supprimé avec succès");
        fetchTeam();
        setIsDeleteMemberDialogOpen(false);
      } else {
        toast.error(result.error?.message || "Erreur lors de la suppression du joueur");
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      toast.error("Erreur lors de la suppression du joueur");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!team) {
    return (
      <div className="min-h-[calc(100vh-5rem)] p-4 md:p-8 flex items-center justify-center">
        <p className="text-muted-foreground">Équipe non trouvée</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <Image
            src={team.logo}
            alt={team.name}
            fill
            sizes="(max-width: 64px) 100vw, 64px"
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Joueurs</CardTitle>
          <Button
            onClick={() => setIsAddMemberDialogOpen(true)}
            className="gap-2"
          >
            <IconUserPlus className="w-4 h-4" />
            Ajouter un joueur
          </Button>
        </CardHeader>
        <CardContent>
          {team.members.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun joueur inscrit
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Numéro</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.members
                  .sort((a, b) => a.number - b.number)
                  .map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {member.number}
                      </TableCell>
                      <TableCell>{member.name}</TableCell>
                      <TableCell>
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
                              onClick={() => handleEditMember(member)}
                              className="gap-2"
                            >
                              <IconEdit className="w-4 h-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteMember(member)}
                              className="gap-2 text-destructive"
                            >
                              <IconTrash className="w-4 h-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddTeamMemberDialog
        teamId={team.id}
        open={isAddMemberDialogOpen}
        onOpenChange={setIsAddMemberDialogOpen}
        onSuccess={fetchTeam}
      />

      {selectedMember && (
        <>
          <EditTeamMemberDialog
            teamId={team.id}
            member={selectedMember}
            open={isEditMemberDialogOpen}
            onOpenChange={setIsEditMemberDialogOpen}
            onSuccess={fetchTeam}
          />

          <ConfirmDialog
            open={isDeleteMemberDialogOpen}
            onOpenChange={setIsDeleteMemberDialogOpen}
            onConfirm={confirmDeleteMember}
            title="Supprimer le joueur"
            description={`Êtes-vous sûr de vouloir supprimer le joueur "${selectedMember.name}" ?`}
            confirmText="Supprimer"
            variant="destructive"
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
} 