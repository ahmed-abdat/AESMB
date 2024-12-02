import { getCurrentSeason } from "@/app/actions/seasons";
import { getTeams } from "@/app/actions/teams";
import { StandingsSection } from "@/components/sections/StandingsSection";
import { calculateStandings } from "@/lib/standings";
import { IconTrophy } from "@tabler/icons-react";
import { Suspense } from "react";
import { NEXT_REVALIDATE_TIME } from "@/constants/next_revalidat_time";
import { Metadata } from "next";

export const revalidate = NEXT_REVALIDATE_TIME;

export async function generateMetadata(): Promise<Metadata> {
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return {
      title: "Classement | Match Champions",
      description: "Consultez le classement du championnat de football.",
    };
  }

  const standings = calculateStandings(season, teams);
  const topFiveTeams = standings
    .slice(0, 5)
    .map((s) => teams.find((t) => t.id === s.stats.teamId))
    .filter(Boolean);

  // Get team names for display
  const topFiveTeamNames = topFiveTeams
    .map((team) => team?.name)
    .filter(Boolean)
    .join(", ");

  // Get team logos for OpenGraph image
  const teamLogos = topFiveTeams.map((team) => team?.logo).filter(Boolean);

  const ogImageUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/og`);
  ogImageUrl.searchParams.set("title", `Classement ${season.name}`);
  ogImageUrl.searchParams.set("subtitle", topFiveTeamNames);
  if (teamLogos.length > 0) {
    ogImageUrl.searchParams.set(
      "logos",
      encodeURIComponent(JSON.stringify(teamLogos))
    );
  }

  return {
    title: `Classement ${season.name} | Match Champions`,
    description: `Consultez le classement complet du championnat ${season.name}. Top 5 actuel : ${topFiveTeamNames}. Découvrez les statistiques de toutes les équipes.`,
    keywords: [
      "classement",
      "championnat",
      "football",
      season.name,
      ...teams.map((team) => team.name),
    ],
    openGraph: {
      title: `Classement ${season.name} | Match Champions`,
      description: `Classement actuel du championnat : ${topFiveTeamNames} en tête.`,
      type: "website",
      locale: "fr_FR",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `Classement ${season.name}`,
        },
      ],
    },
  };
}

export default async function StandingsPage() {
  const { success: seasonSuccess, season: fetchedSeason } =
    await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !fetchedSeason || !teamsSuccess || !teams) {
    return (
      <main className="min-h-screen pt-16">
        <div className="px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Données non disponibles
            </h1>
            <p className="text-muted-foreground">
              Les informations du classement ne sont pas disponibles pour le
              moment. Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const standings = calculateStandings(fetchedSeason, teams);

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold">
            <IconTrophy className="h-5 w-5 md:h-6 md:w-6" />
            <h1 className="text-lg md:text-2xl">Classement</h1>
          </div>
          <span className="ml-auto text-sm md:text-base text-muted-foreground">
            Saison {fetchedSeason.name}
          </span>
        </div>
      </div>

      <div className="py-4 md:py-8 px-4 md:px-8">
        <Suspense
          fallback={
            <div className="text-center py-8">Chargement du classement...</div>
          }
        >
          <StandingsSection
            season={fetchedSeason}
            standings={standings}
            teams={teams}
          />
        </Suspense>
      </div>
    </main>
  );
}
