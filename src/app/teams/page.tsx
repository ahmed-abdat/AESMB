import { getTeams } from "@/app/actions/teams";
import { getCurrentSeason } from "@/app/actions/seasons";
import { TeamsOverviewSection } from "@/components/sections/TeamsOverviewSection";
import { IconUsers, IconTrophy, IconCalendar } from "@tabler/icons-react";
import { NEXT_REVALIDATE_TIME } from "@/constants/next_revalidat_time";
import { calculateStandings } from "@/lib/standings";
import { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = NEXT_REVALIDATE_TIME;

export async function generateMetadata(): Promise<Metadata> {
  const { success: teamsSuccess, teams } = await getTeams();
  const { success: seasonSuccess, season: currentSeason } =
    await getCurrentSeason();

  if (!teamsSuccess || !seasonSuccess || !teams || !currentSeason) {
    return {
      title: "Équipes | Match Champions",
      description: "Découvrez toutes les équipes participant au championnat.",
    };
  }

  // Get participating teams
  const participatingTeams = teams.filter((team) =>
    team.seasons.includes(currentSeason.id)
  );
  const teamNames = participatingTeams.map((team) => team.name).join(", ");

  // Create OpenGraph image URL with team logos
  const ogImageUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/og`);
  ogImageUrl.searchParams.set("title", "Équipes du Championnat");
  ogImageUrl.searchParams.set("subtitle", currentSeason.name);
  
  const teamLogos = participatingTeams.map(team => team.logo).filter(Boolean);
  if (teamLogos.length > 0) {
    ogImageUrl.searchParams.set("logos", encodeURIComponent(JSON.stringify(teamLogos)));
  }

  return {
    title: "Équipes | Match Champions",
    description: `Découvrez toutes les équipes participant au championnat ${currentSeason.name}. Équipes participantes : ${teamNames}. Consultez leurs statistiques, résultats et performances tout au long de la saison.`,
    openGraph: {
      title: "Équipes | Match Champions",
      description: `Équipes participantes au championnat ${currentSeason.name} : ${teamNames}`,
      type: "website",
      locale: "fr_FR",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: "Équipes du championnat",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Équipes | Match Champions",
      description: `Équipes du championnat ${currentSeason.name}`,
      images: [ogImageUrl.toString()],
    },
    keywords: [
      "football",
      "équipes",
      "championnat",
      currentSeason.name,
      ...participatingTeams.map((team) => team.name),
    ],
  };
}

export default async function TeamsPage() {
  const { success: teamsSuccess, teams } = await getTeams();
  const { success: seasonSuccess, season: currentSeason } =
    await getCurrentSeason();

  if (!teamsSuccess || !seasonSuccess || !teams || !currentSeason) {
    return (
      <main className="min-h-screen pt-16">
        <div className="px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            Données non disponibles
          </h1>
        </div>
      </main>
    );
  }

  // Calculate standings if we have a current season
  const standings = currentSeason
    ? calculateStandings(currentSeason, teams)
    : [];

  // Get participating teams
  const participatingTeams = currentSeason
    ? teams.filter((team) => team.seasons.includes(currentSeason.id))
    : [];

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold">
            <IconUsers className="h-5 w-5 md:h-6 md:w-6" />
            <h1 className="text-lg md:text-2xl">Équipes</h1>
          </div>
        </div>
      </div>

      <div className="py-4 md:py-8 px-4 md:px-8">
        <TeamsOverviewSection
          teams={teams}
          currentSeason={currentSeason}
          standings={standings}
          participatingTeams={participatingTeams}
        />
      </div>
    </main>
  );
}
