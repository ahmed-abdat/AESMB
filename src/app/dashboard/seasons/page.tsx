import { getAllSeasons } from "@/app/actions/seasons";
import { getAllTeams } from "@/app/actions/teams";
import { SeasonsPageContent } from "@/components/dashboard/seasons/SeasonsPageContent";

export default async function SeasonsPage() {
  const [seasonsResult, teamsResult] = await Promise.all([
    getAllSeasons(),
    getAllTeams(),
  ]);

  if (!seasonsResult.success || !teamsResult.success) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          {seasonsResult.error?.message ||
            teamsResult.error?.message ||
            "Erreur lors du chargement des données"}
        </p>
      </div>
    );
  }

  return (
    <SeasonsPageContent
      initialSeasons={seasonsResult.seasons}
      teams={teamsResult.teams}
    />
  );
}
