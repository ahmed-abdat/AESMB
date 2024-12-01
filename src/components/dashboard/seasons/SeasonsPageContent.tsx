"use client";

import { Season } from "@/types/season";
import { Team } from "@/types/team";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { subscribeToSeasons } from "@/lib/firebase/subscriptions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  IconArrowLeft, 
  IconCalendar, 
  IconUsers, 
  IconPlus,
  IconEdit,
  IconTrash,
  IconTrophy
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EditSeasonDialog } from "./EditSeasonDialog";
import { AddSeasonDialog } from "./AddSeasonDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteSeason } from "@/app/actions/seasons";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SeasonsPageContentProps {
  initialSeasons: Season[];
  teams: Team[];
}

export function SeasonsPageContent({ initialSeasons, teams }: SeasonsPageContentProps) {
  const [seasons, setSeasons] = useState<Season[]>(initialSeasons);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);

  // Function to determine if a season is current
  const isCurrentSeason = (season: Season) => {
    const now = new Date();
    const startDate = new Date(season.startDate);
    const endDate = new Date(season.endDate);
    return now >= startDate && now <= endDate;
  };

  // Function to determine if a season is upcoming
  const isUpcomingSeason = (season: Season) => {
    const now = new Date();
    const startDate = new Date(season.startDate);
    return now < startDate;
  };

  // Function to determine if a season is completed
  const isCompletedSeason = (season: Season) => {
    const now = new Date();
    const endDate = new Date(season.endDate);
    return now > endDate;
  };

  // Function to get participating teams count for a season
  const getParticipatingTeamsCount = (season: Season) => {
    return teams.filter(team => 
      team.seasons?.some(seasonId => seasonId === season.id)
    ).length;
  };

  useEffect(() => {
    const unsubscribe = subscribeToSeasons((updatedSeasons) => {
      const sortedSeasons = [...updatedSeasons].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
      setSeasons(sortedSeasons);
    });
    return () => unsubscribe();
  }, []);

  // Group seasons by status
  const currentSeasons = seasons.filter(isCurrentSeason);
  const upcomingSeasons = seasons.filter(isUpcomingSeason);
  const completedSeasons = seasons.filter(isCompletedSeason);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2 mb-4">
              <IconArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Saisons</h1>
          <p className="text-muted-foreground">
            Gérez les saisons du championnat
          </p>
        </div>
        <Button 
          className="gap-2" 
          onClick={() => setShowAddDialog(true)}
        >
          <IconPlus className="w-4 h-4" />
          Nouvelle Saison
        </Button>
      </div>

      {/* Current Seasons */}
      {currentSeasons.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-green-600">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            Saison en cours
          </h2>
          <div className="grid gap-4">
            {currentSeasons.map((season) => (
              <SeasonCard key={season.id} season={season} teams={teams} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Seasons */}
      {upcomingSeasons.length > 0 && (
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-blue-600">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            Saisons à venir
          </h2>
          <div className="grid gap-4">
            {upcomingSeasons.map((season) => (
              <SeasonCard key={season.id} season={season} teams={teams} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Seasons */}
      {completedSeasons.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-600">
            <div className="w-2 h-2 rounded-full bg-gray-500" />
            Saisons terminées
          </h2>
          <div className="grid gap-4">
            {completedSeasons.map((season) => (
              <SeasonCard key={season.id} season={season} teams={teams} />
            ))}
          </div>
        </div>
      )}

      {/* Add Season Dialog */}
      <AddSeasonDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
      />

      {/* Edit Season Dialog */}
      {selectedSeason && (
        <EditSeasonDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          season={selectedSeason}
        />
      )}
    </div>
  );
}

// Season Card Component
function SeasonCard({ season, teams }: { season: Season; teams: Team[] }) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking edit button
    setShowEditDialog(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when clicking delete button
    const participatingTeamsCount = getParticipatingTeamsCount();
    if (participatingTeamsCount > 0) {
      toast.error(
        `Impossible de supprimer cette saison car ${participatingTeamsCount} équipe${
          participatingTeamsCount > 1 ? 's' : ''
        } y participe${participatingTeamsCount > 1 ? 'nt' : ''}`
      );
      return;
    }
    setShowDeleteDialog(true);
  };

  const handleCardClick = () => {
    router.push(`/dashboard/seasons/${season.id}`);
  };

  const confirmDelete = async () => {
    // Double check to prevent deletion if teams were added while dialog was open
    const participatingTeamsCount = getParticipatingTeamsCount();
    if (participatingTeamsCount > 0) {
      toast.error(
        `Impossible de supprimer cette saison car ${participatingTeamsCount} équipe${
          participatingTeamsCount > 1 ? 's' : ''
        } y participe${participatingTeamsCount > 1 ? 'nt' : ''}`
      );
      setShowDeleteDialog(false);
      return;
    }

    try {
      setIsDeleting(true);
      const result = await deleteSeason(season.id);

      if (result.success) {
        toast.success("Saison supprimée avec succès");
        setShowDeleteDialog(false);
      } else {
        toast.error(
          result.error?.message || "Erreur lors de la suppression de la saison"
        );
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  const getParticipatingTeamsCount = () => {
    return teams.filter((team) =>
      team.seasons?.some((seasonId) => seasonId === season.id)
    ).length;
  };

  const getStatusBadge = () => {
    const now = new Date();
    const startDate = new Date(season.startDate);
    const endDate = new Date(season.endDate);

    if (now >= startDate && now <= endDate) {
      return (
        <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20">
          En cours
        </Badge>
      );
    } else if (now < startDate) {
      return (
        <Badge variant="secondary" className="text-blue-600">
          À venir
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="text-gray-600">
          Terminé
        </Badge>
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={cn(
          "hover:bg-muted/50 transition-all duration-200",
          "cursor-pointer hover:shadow-md"
        )}
        onClick={handleCardClick}
      >
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            {/* Header with Name and Status */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold">{season.name}</h3>
                {getStatusBadge()}
              </div>
            </div>

            {/* Date Range */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <IconCalendar className="w-4 h-4" />
              <span>
                {new Date(season.startDate).toLocaleDateString()} -{" "}
                {new Date(season.endDate).toLocaleDateString()}
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconUsers className="w-4 h-4" />
                <span>{getParticipatingTeamsCount()} équipes</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <IconTrophy className="w-4 h-4" />
                <span>Points: 3/1/0</span>
              </div>
            </div>

            {/* Actions Row */}
            <div
              className="flex items-center gap-2 pt-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={handleEdit}
              >
                <IconEdit className="w-4 h-4" />
                Modifier
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "gap-2",
                  getParticipatingTeamsCount() > 0
                    ? "text-gray-400 hover:text-gray-400 hover:bg-gray-100 cursor-not-allowed"
                    : "text-red-600 hover:text-red-600 hover:bg-red-50"
                )}
                onClick={handleDelete}
                disabled={getParticipatingTeamsCount() > 0}
                title={
                  getParticipatingTeamsCount() > 0
                    ? "Impossible de supprimer une saison avec des équipes participantes"
                    : "Supprimer la saison"
                }
              >
                <IconTrash className="w-4 h-4" />
                Supprimer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        title="Supprimer la saison"
        description={
          <>
            Êtes-vous sûr de vouloir supprimer la saison{" "}
            <strong>{season.name}</strong> ?
            <br />
            Cette action est irréversible et supprimera toutes les données
            associées à cette saison.
          </>
        }
        confirmText="Supprimer"
        variant="destructive"
        isLoading={isDeleting}
      />

      {/* Edit Season Dialog */}
      {showEditDialog && (
        <EditSeasonDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          season={season}
        />
      )}
    </motion.div>
  );
}
