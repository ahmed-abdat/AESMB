import { getCurrentSeason } from "@/app/actions/seasons";
import { getTeams } from "@/app/actions/teams";
import { ResultsSection } from "@/components/sections/ResultsSection";
import { IconCalendarStats } from "@tabler/icons-react";
import { Suspense } from "react";
export const revalidate = 60;

export default async function ResultsPage() {
  const { success: seasonSuccess, season: fetchedSeason } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !fetchedSeason || !teamsSuccess || !teams) {
    return (
      <main className="min-h-screen pt-16">
        <div className="px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">Aucune saison trouvée</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold">
            <IconCalendarStats className="h-5 w-5 md:h-6 md:w-6" />
            <h1 className="text-lg md:text-2xl">Résultats</h1>
          </div>
          <span className="ml-auto text-sm md:text-base text-muted-foreground">
            Saison {fetchedSeason.name}
          </span>
        </div>
      </div>

      <div className="py-4 md:py-8 px-4 md:px-8">
        <Suspense
          fallback={
            <div className="text-center py-8">Chargement des résultats...</div>
          }
        >
          <ResultsSection 
            season={fetchedSeason}
            teams={teams}
          />
        </Suspense>
      </div>
    </main>
  );
} 