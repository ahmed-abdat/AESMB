"use client";

import { Team, TeamMember } from "@/types/team";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { 
  IconUserPlus, 
  IconEdit, 
  IconTrash, 
  IconDotsVertical, 
  IconUsers, 
  IconArrowLeft,
  IconUserX 
} from "@tabler/icons-react";
import { AddTeamMemberDialog } from "./AddTeamMemberDialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditTeamMemberDialog } from "./EditTeamMemberDialog";
import { deleteTeamMember } from "@/app/actions/teams";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { subscribeToTeam } from "@/lib/firebase/subscriptions";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

interface TeamDetailsProps {
  team: Team;
}

export function TeamDetails({ team: initialTeam }: TeamDetailsProps) {
  const [team, setTeam] = useState<Team>(initialTeam);
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isEditMemberDialogOpen, setIsEditMemberDialogOpen] = useState(false);
  const [isDeleteMemberDialogOpen, setIsDeleteMemberDialogOpen] = useState(false);
  const [isDeleteAllMembersDialogOpen, setIsDeleteAllMembersDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToTeam(initialTeam.id, (updatedTeam) => {
      if (updatedTeam) {
        setTeam(updatedTeam);
      }
    });

    return () => unsubscribe();
  }, [initialTeam.id]);

  const handleEditMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsEditMemberDialogOpen(true);
  };

  const handleDeleteMember = (member: TeamMember) => {
    setSelectedMember(member);
    setIsDeleteMemberDialogOpen(true);
  };

  const confirmDeleteMember = async () => {
    if (!selectedMember) return;

    setIsLoading(true);
    try {
      const result = await deleteTeamMember(team.id, selectedMember.id);
      
      if (result.success) {
        toast.success("Joueur supprimé avec succès");
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

  const confirmDeleteAllMembers = async () => {
    setIsLoading(true);
    try {
      // Update the team document to have an empty members array
      const teamRef = doc(db, "teams", team.id);
      await updateDoc(teamRef, { members: [] });
      toast.success("Tous les joueurs ont été supprimés");
      setIsDeleteAllMembersDialogOpen(false);
    } catch (error) {
      console.error("Error deleting all members:", error);
      toast.error("Erreur lors de la suppression des joueurs");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/teams">
          <Button variant="ghost" size="sm" className="gap-2">
            <IconArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
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
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconUsers className="w-4 h-4" />
              <span>{team.members.length} joueurs inscrits</span>
            </div>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Joueurs</CardTitle>
          <div className="flex items-center gap-2">
            {team.members.length > 0 && (
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => setIsDeleteAllMembersDialogOpen(true)}
              >
                <IconUserX className="w-4 h-4" />
                Supprimer tous les joueurs
              </Button>
            )}
            <Button
              onClick={() => setIsAddMemberDialogOpen(true)}
              className="gap-2"
            >
              <IconUserPlus className="w-4 h-4" />
              Ajouter un joueur
            </Button>
          </div>
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
                  <TableHead>Nom</TableHead>
                  <TableHead className="text-center">Buts</TableHead>
                  <TableHead className="text-center">Passes</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {team.members
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((member) => (
                    <TableRow key={member.id}>
                      <TableCell>{member.name}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{member.stats.goals}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary">{member.stats.assists}</Badge>
                      </TableCell>
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
      />

      {selectedMember && (
        <>
          <EditTeamMemberDialog
            teamId={team.id}
            member={selectedMember}
            open={isEditMemberDialogOpen}
            onOpenChange={setIsEditMemberDialogOpen}
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

      <ConfirmDialog
        open={isDeleteAllMembersDialogOpen}
        onOpenChange={setIsDeleteAllMembersDialogOpen}
        onConfirm={confirmDeleteAllMembers}
        title="Supprimer tous les joueurs"
        description="Êtes-vous sûr de vouloir supprimer tous les joueurs de cette équipe ? Cette action est irréversible."
        confirmText="Supprimer tous"
        variant="destructive"
        isLoading={isLoading}
      />
    </div>
  );
} 