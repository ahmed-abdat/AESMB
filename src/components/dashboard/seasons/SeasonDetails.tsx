"use client";

import { useState, useEffect } from "react";
import { Season } from "@/types/season";
import { Team } from "@/types/team";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeasonOverview } from "@/components/dashboard/seasons/SeasonOverview";
import { SeasonMatches } from "@/components/dashboard/seasons/SeasonMatches";
import { SeasonStandings } from "@/components/dashboard/seasons/SeasonStandings";
import { getSeasonTeams } from "@/app/actions/seasons";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconUsers } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

interface SeasonDetailsProps {
  season: Season;
  totalTeams: number;
}

export function SeasonDetails({ season, totalTeams }: SeasonDetailsProps) {
  const [teams, setTeams] = useState<Team[]>([]);

  const fetchTeams = async () => {
    const result = await getSeasonTeams(season.id);
    if (result.success && result.teams) {
      setTeams(result.teams);
    } else {
      toast.error(
        result.error?.message || "Erreur lors du chargement des équipes"
      );
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [season]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/seasons">
            <Button variant="ghost" size="sm" className="gap-2">
              <IconArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{season.name}</h1>
          <p className="text-muted-foreground">Gestion de la saison</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <IconUsers className="w-4 h-4 text-muted-foreground" />
            <Badge variant="secondary" className="text-sm">
              {teams.length} équipe{teams.length > 1 ? "s" : ""} participante{teams.length > 1 ? "s" : ""} sur {totalTeams}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="standings">Classement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SeasonOverview season={season} onUpdate={() => {}} />
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <SeasonMatches season={season} teams={teams} onUpdate={() => {}} />
        </TabsContent>

        <TabsContent value="standings" className="space-y-4">
          <SeasonStandings
            season={season}
            teams={teams}
            onUpdate={() => {}}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 