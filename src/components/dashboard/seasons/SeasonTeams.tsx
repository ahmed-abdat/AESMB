"use client";

import { Season } from "@/types/season";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

interface SeasonTeamsProps {
  season: Season;
  onUpdate: () => void;
}

export function SeasonTeams({ season, onUpdate }: SeasonTeamsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Équipes</h3>
          <p className="text-sm text-muted-foreground">
            Gérez les équipes participant à la saison
          </p>
        </div>
        <Button className="gap-2">
          <IconPlus className="h-4 w-4" />
          Ajouter une équipe
        </Button>
      </div>

      {/* Teams list will go here */}
      <div className="text-muted-foreground text-sm">
        Fonctionnalité en cours de développement...
      </div>
    </div>
  );
} 