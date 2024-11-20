import { getSeasonData, getTotalTeams } from "@/app/actions/seasons";
import { SeasonDetails } from "@/components/dashboard/seasons/SeasonDetails";

export default async function SeasonDetailsPage({
  params,
}: {
  params: { seasonId: string };
}) {
  const [seasonResult, totalTeamsResult] = await Promise.all([
    getSeasonData(params.seasonId),
    getTotalTeams(),
  ]);

  if (!seasonResult.success || !seasonResult.season) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">
          {seasonResult.error?.message || "Saison non trouvée"}
        </p>
      </div>
    );
  }

  return (
    <SeasonDetails 
      season={seasonResult.season} 
      totalTeams={totalTeamsResult.total} 
    />
  );
}
