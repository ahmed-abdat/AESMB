"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconPlus,
  IconEdit,
  IconTrash,
  IconCalendar,
  IconTrophy,
  IconUsers,
  IconChevronRight,
} from "@tabler/icons-react";
import { Season } from "@/types/season";
import { AddSeasonDialog } from "./AddSeasonDialog";
import { EditSeasonDialog } from "./EditSeasonDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { deleteSeason } from "@/app/actions/seasons";
import { toast } from "sonner";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const statusColors = {
  upcoming: "bg-blue-500/10 text-blue-500",
  ongoing: "bg-green-500/10 text-green-500",
  completed: "bg-orange-500/10 text-orange-500",
};

const statusLabels = {
  upcoming: "À venir",
  ongoing: "En cours",
  completed: "Terminé",
};

interface SeasonsSectionProps {
  seasons: Season[];
  onUpdate: () => void;
}

export function SeasonsSection({ seasons, onUpdate }: SeasonsSectionProps) {
  console.log(seasons[0].rounds.length);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (season: Season) => {
    setSelectedSeason(season);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (season: Season) => {
    setSelectedSeason(season);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSeason) return;

    setIsLoading(true);
    try {
      await deleteSeason(selectedSeason.id);
      toast.success("Saison supprimée avec succès");
      onUpdate();
    } catch (error) {
      console.error("Error deleting season:", error);
      toast.error("Erreur lors de la suppression de la saison");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Saisons</h2>
          <p className="text-muted-foreground">
            Gérez les saisons du championnat
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
          <IconPlus className="w-4 h-4" />
          Ajouter une saison
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {seasons.map((season) => (
            <motion.div
              key={season.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/dashboard/seasons/${season.id}`}>
                <Card className="hover:bg-muted/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{season.name}</span>
                      <Badge
                        variant="secondary"
                        className={statusColors[season.status]}
                      >
                        {statusLabels[season.status]}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <IconCalendar className="w-4 h-4" />
                      <span>
                        {format(season.startDate, "d MMMM yyyy", {
                          locale: fr,
                        })}{" "}
                        -{" "}
                        {format(season.endDate, "d MMMM yyyy", { locale: fr })}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IconTrophy className="w-4 h-4" />
                        <span>
                          Points: {season.pointsSystem.win}/
                          {season.pointsSystem.draw}/{season.pointsSystem.loss}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <IconUsers className="w-4 h-4" />
                          <span>{season.rounds.length} équipes</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={(e) => {
                              e.preventDefault();
                              handleEdit(season);
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
                              e.preventDefault();
                              handleDelete(season);
                            }}
                          >
                            <IconTrash className="w-4 h-4" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-end text-muted-foreground">
                        <IconChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AddSeasonDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSuccess={onUpdate}
      />

      {selectedSeason && (
        <>
          <EditSeasonDialog
            season={selectedSeason}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            onSuccess={onUpdate}
          />

          <ConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            onConfirm={confirmDelete}
            title="Supprimer la saison"
            description={`Êtes-vous sûr de vouloir supprimer la saison "${selectedSeason.name}" ? Cette action est irréversible.`}
            confirmText="Supprimer"
            variant="destructive"
            isLoading={isLoading}
          />
        </>
      )}
    </div>
  );
}
