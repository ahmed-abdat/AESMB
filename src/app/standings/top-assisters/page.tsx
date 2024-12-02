import { getCurrentSeason } from "@/app/actions/seasons";
import { getTeams } from "@/app/actions/teams";
import { IconHandStop } from "@tabler/icons-react";
import { NEXT_REVALIDATE_TIME } from "@/constants/next_revalidat_time";
import { Metadata } from "next";
import { calculateTopAssisters } from "@/lib/stats";
import { StatsSection } from "@/components/sections/stats-section";
import { assistersColumns } from "@/config/table-columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconArrowLeft } from "@tabler/icons-react";

export const revalidate = NEXT_REVALIDATE_TIME;

export async function generateMetadata(): Promise<Metadata> {
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return {
      title: "Meilleurs Passeurs | Match Champions",
      description: "Découvrez les meilleurs passeurs du championnat.",
    };
  }

  const topAssisters = calculateTopAssisters(season, teams);
  const topFiveAssisters = topAssisters.slice(0, 5).map((assister) => {
    const team = teams.find((t) => t.id === assister.teamId);
    return {
      name: assister.playerName,
      assists: assister.assists,
      team,
    };
  });

  const topFiveText = topFiveAssisters
    .map((assister) => `${assister.name} (${assister.assists} passes)`)
    .join(", ");

  // Get team logos for OpenGraph image
  const teamLogos = topFiveAssisters
    .map((assister) => assister.team?.logo)
    .filter(Boolean);

  const ogImageUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/og`);
  ogImageUrl.searchParams.set("title", `Meilleurs Passeurs ${season.name}`);
  ogImageUrl.searchParams.set("subtitle", topFiveText);
  if (teamLogos.length > 0) {
    ogImageUrl.searchParams.set(
      "logos",
      encodeURIComponent(JSON.stringify(teamLogos))
    );
  }

  return {
    title: `Meilleurs Passeurs ${season.name} | Match Champions`,
    description: `Découvrez les meilleurs passeurs du championnat ${season.name}. Top 5 : ${topFiveText}.`,
    keywords: [
      "passeurs",
      "statistiques",
      "football",
      season.name,
      ...topAssisters.map((assister) => assister.playerName),
    ],
    openGraph: {
      title: `Meilleurs Passeurs ${season.name} | Match Champions`,
      description: `Top 5 des passeurs : ${topFiveText}`,
      type: "website",
      locale: "fr_FR",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `Meilleurs Passeurs ${season.name}`,
        },
      ],
    },
  };
}

export default async function TopAssistersPage() {
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return (
      <main className="min-h-screen pt-16">
        <div className="px-4 md:px-8">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold">
              Données non disponibles
            </h1>
            <p className="text-muted-foreground">
              Les statistiques des passeurs ne sont pas disponibles pour le
              moment.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const assisters = calculateTopAssisters(season, teams);

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <Link href="/standings">
            <Button variant="ghost" size="sm" className="gap-2">
              <IconArrowLeft className="w-4 h-4" />
              Retour au classement
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <StatsSection
          header={{
            title: "Meilleurs Passeurs",
            subtitle: `Saison ${season.name}`,
            icon: <IconHandStop className="h-5 w-5 md:h-6 md:w-6" />,
          }}
          data={assisters}
          columns={assistersColumns}
          teams={teams}
          showSearch={true}
          searchStatKey="assists"
          searchStatLabel="Passes D."
          highlightTopThree={true}
        />
      </div>
    </main>
  );
}
