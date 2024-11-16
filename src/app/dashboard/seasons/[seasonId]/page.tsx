"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Season } from "@/types/season";
import { Team } from "@/types/team";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SeasonOverview } from "@/components/dashboard/seasons/SeasonOverview";
import { SeasonMatches } from "@/components/dashboard/seasons/SeasonMatches";
import { SeasonStandings } from "@/components/dashboard/seasons/SeasonStandings";
import { convertFirestoreDataToSeason } from "@/types/season";
import { getSeasonTeams } from "@/app/actions/seasons";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft, IconUsers } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";

export default function SeasonDetailsPage() {
  const params = useParams();
  const [season, setSeason] = useState<Season | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalTeams, setTotalTeams] = useState(0);

  const fetchSeason = async () => {
    try {
      const seasonDoc = await getDoc(
        doc(db, "seasons", params.seasonId as string)
      );
      if (seasonDoc.exists()) {
        setSeason(convertFirestoreDataToSeason(seasonDoc.id, seasonDoc.data()));
      } else {
        toast.error("Saison non trouvée");
      }
    } catch (error) {
      console.error("Error fetching season:", error);
      toast.error("Erreur lors du chargement de la saison");
    }
  };

  const fetchTeams = async () => {
    if (!season) return;

    const result = await getSeasonTeams(season.id);
    if (result.success && result.teams) {
      setTeams(result.teams);
    } else {
      toast.error(
        result.error?.message || "Erreur lors du chargement des équipes"
      );
    }
  };

  const fetchTotalTeams = async () => {
    try {
      const teamsRef = collection(db, "teams");
      const teamsSnapshot = await getDocs(teamsRef);
      setTotalTeams(teamsSnapshot.size);
    } catch (error) {
      console.error("Error fetching total teams:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (params.seasonId) {
        await fetchSeason();
        await fetchTotalTeams();
        setLoading(false);
      }
    };
    init();
  }, [params.seasonId]);

  useEffect(() => {
    if (season) {
      fetchTeams();
    }
  }, [season]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!season) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Saison non trouvée</p>
      </div>
    );
  }

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
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
          <TabsTrigger value="standings">Classement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <SeasonOverview season={season} onUpdate={fetchSeason} />
        </TabsContent>

        <TabsContent value="matches" className="space-y-4">
          <SeasonMatches season={season} teams={teams} onUpdate={fetchSeason} />
        </TabsContent>

        <TabsContent value="standings" className="space-y-4">
          <SeasonStandings
            season={season}
            teams={teams}
            onUpdate={fetchSeason}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
