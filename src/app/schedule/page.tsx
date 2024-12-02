import { getCurrentSeason } from "@/app/actions/seasons";
import { getTeams } from "@/app/actions/teams";
import { ScheduleSection } from "@/components/sections/ScheduleSection";
import { IconCalendar } from "@tabler/icons-react";
import { Suspense } from "react";
import { NEXT_REVALIDATE_TIME } from "@/constants/next_revalidat_time";
import { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const revalidate = NEXT_REVALIDATE_TIME;

export async function generateMetadata(): Promise<Metadata> {
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return {
      title: "Calendrier | Match Champions",
      description: "Consultez le calendrier des matchs de football.",
    };
  }

  // Get the next match
  const now = new Date();
  const nextMatch = season.rounds
    .flatMap((round) => round.matches)
    .find((match) => new Date(match.date) > now);

  let subtitle = "";
  let teamLogos: string[] = [];

  if (nextMatch) {
    const homeTeam = teams.find((t) => t.id === nextMatch.homeTeamId);
    const awayTeam = teams.find((t) => t.id === nextMatch.awayTeamId);
    const matchDate = format(new Date(nextMatch.date), "d MMMM yyyy", {
      locale: fr,
    });

    subtitle = `Prochain match : ${homeTeam?.name || ""} vs ${
      awayTeam?.name || ""
    } - ${matchDate}`;

    if (homeTeam?.logo && awayTeam?.logo) {
      teamLogos = [homeTeam.logo, awayTeam.logo];
    }
  }

  const ogImageUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/og`);
  ogImageUrl.searchParams.set("title", `Calendrier ${season.name}`);
  if (subtitle) ogImageUrl.searchParams.set("subtitle", subtitle);
  if (teamLogos.length > 0) {
    ogImageUrl.searchParams.set(
      "logos",
      encodeURIComponent(JSON.stringify(teamLogos))
    );
  }

  return {
    title: `Calendrier ${season.name} | Match Champions`,
    description: `Consultez le calendrier complet des matchs de la saison ${season.name}. ${subtitle}`,
    keywords: [
      "calendrier",
      "matchs",
      "football",
      season.name,
      ...teams.map((team) => team.name),
    ],
    openGraph: {
      title: `Calendrier ${season.name} | Match Champions`,
      description:
        subtitle || `Calendrier des matchs de la saison ${season.name}`,
      type: "website",
      locale: "fr_FR",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `Calendrier ${season.name}`,
        },
      ],
    },
  };
}

export default async function SchedulePage() {
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
              Les informations du calendrier ne sont pas disponibles pour le
              moment. Veuillez réessayer plus tard.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold">
            <IconCalendar className="h-5 w-5 md:h-6 md:w-6" />
            <h1 className="text-lg md:text-2xl">Calendrier</h1>
          </div>
          <span className="ml-auto text-sm md:text-base text-muted-foreground">
            Saison {fetchedSeason.name}
          </span>
        </div>
      </div>

      <div className="py-4 md:py-8 px-4 md:px-8">
        <Suspense
          fallback={
            <div className="text-center py-8">Chargement du calendrier...</div>
          }
        >
          <ScheduleSection season={fetchedSeason} teams={teams} />
        </Suspense>
      </div>
    </main>
  );
}
