import { getCurrentSeason } from "@/app/actions/seasons";
import { getTeams } from "@/app/actions/teams";
import { MatchDetailsSection } from "@/components/sections/MatchDetailsSection";
import { IconBallFootball } from "@tabler/icons-react";
import { notFound } from "next/navigation";
import { NEXT_REVALIDATE_TIME } from "@/constants/next_revalidat_time";
import { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const revalidate = NEXT_REVALIDATE_TIME;

interface MatchPageProps {
  params: {
    matchId: string;
  };
}

export async function generateMetadata({
  params,
}: MatchPageProps): Promise<Metadata> {
  const { matchId } = params;
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return {
      title: "Match non trouvé | Match Champions",
      description: "Les détails du match ne sont pas disponibles.",
    };
  }

  // Find the match in the season
  const match = season.rounds
    .flatMap((round) =>
      round.matches.map((match) => ({
        ...match,
        roundNumber: round.number,
      }))
    )
    .find((match) => match.id === matchId);

  if (!match) {
    return {
      title: "Match non trouvé | Match Champions",
      description: "Les détails du match ne sont pas disponibles.",
    };
  }

  const homeTeam = teams.find((t) => t.id === match.homeTeamId);
  const awayTeam = teams.find((t) => t.id === match.awayTeamId);
  const matchDate = format(new Date(match.date), "d MMMM yyyy", { locale: fr });
  const matchScore =
    match.status === "completed"
      ? `${match.result?.homeScore}-${match.result?.awayScore}`
      : "vs";

  // Prepare team logos for OpenGraph image
  const teamLogos = [];
  if (homeTeam?.logo) teamLogos.push(homeTeam.logo);
  if (awayTeam?.logo) teamLogos.push(awayTeam.logo);

  const ogImageUrl = new URL(`${process.env.NEXT_PUBLIC_APP_URL}/api/og`);
  ogImageUrl.searchParams.set(
    "title",
    `${homeTeam?.name || ""} ${matchScore} ${awayTeam?.name || ""}`
  );
  ogImageUrl.searchParams.set(
    "subtitle",
    `Journée ${match.roundNumber} - ${matchDate}`
  );
  if (teamLogos.length > 0) {
    ogImageUrl.searchParams.set(
      "logos",
      encodeURIComponent(JSON.stringify(teamLogos))
    );
  }

  return {
    title: `${homeTeam?.name || ""} ${matchScore} ${
      awayTeam?.name || ""
    } | Match Champions`,
    description: `${homeTeam?.name || ""} contre ${
      awayTeam?.name || ""
    } - Journée ${match.roundNumber} du championnat ${
      season.name
    }. Match joué le ${matchDate}.`,
    keywords: [
      "match",
      "football",
      homeTeam?.name || "",
      awayTeam?.name || "",
      season.name,
      `journée ${match.roundNumber}`,
    ],
    openGraph: {
      title: `${homeTeam?.name || ""} ${matchScore} ${
        awayTeam?.name || ""
      } | Journée ${match.roundNumber}`,
      description: `Match ${
        match.status === "completed" ? "joué" : "prévu"
      } le ${matchDate}`,
      type: "website",
      locale: "fr_FR",
      images: [
        {
          url: ogImageUrl.toString(),
          width: 1200,
          height: 630,
          alt: `${homeTeam?.name || ""} vs ${awayTeam?.name || ""}`,
        },
      ],
    },
  };
}

export default async function MatchPage({ params }: MatchPageProps) {
  const { matchId } = params;
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return notFound();
  }

  // Find the match in the season
  const match = season.rounds
    .flatMap((round) =>
      round.matches.map((match) => ({
        ...match,
        roundNumber: round.number,
      }))
    )
    .find((match) => match.id === matchId);

  if (!match) {
    return notFound();
  }

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold">
            <IconBallFootball className="h-5 w-5 md:h-6 md:w-6" />
            <h1 className="text-lg md:text-2xl">Détails du Match</h1>
          </div>
          <span className="ml-auto text-sm md:text-base text-muted-foreground">
            Journée {match.roundNumber}
          </span>
        </div>
      </div>

      <div className="py-4 md:py-8 px-4 md:px-8">
        <MatchDetailsSection match={match} teams={teams} />
      </div>
    </main>
  );
}
