import { Hero } from "@/components/Hero";
import { UpcomingMatches } from "@/components/sections/UpcomingMatches";
import { StandingsTable } from "@/components/sections/StandingsTable";
import { getCurrentSeason } from "./actions/seasons";
import { getTeams } from "./actions/teams";
import { calculateStandings } from "@/lib/standings";
import { Standing } from "@/types/season";
import { NEXT_REVALIDATE_TIME } from "@/constants/next_revalidat_time";
import { Metadata } from "next";
import { getOgImageUrl } from "@/lib/og-url";

export const revalidate = NEXT_REVALIDATE_TIME;

// export async function generateMetadata(): Promise<Metadata> {
//   const { success: seasonSuccess, season } = await getCurrentSeason();
//   const { success: teamsSuccess, teams } = await getTeams();

//   let teamLogos: string[] = [];
//   if (seasonSuccess && season && teamsSuccess && teams) {
//     const standings = calculateStandings(season, teams);
//     const topFiveTeams = standings
//       .slice(0, 5)
//       .map((s) => teams.find((t) => t.id === s.stats.teamId))
//       .filter(Boolean);

//     teamLogos = topFiveTeams.map((team) => team?.logo || "").filter(Boolean);
//   }

//   const ogImageUrl = getOgImageUrl(
//     "Match Champions",
//     "Championnat de Football Amateur",
//     teamLogos
//   );

//   return {
//     title: "Match Champions | Championnat de Football Amateur",
//     description:
//       "Suivez en direct les résultats, le classement et les statistiques du championnat de football amateur Match Champions.",
//     keywords: [
//       "football",
//       "championnat",
//       "amateur",
//       "résultats",
//       "classement",
//       "statistiques",
//     ],
//     openGraph: {
//       title: "Match Champions | Championnat de Football Amateur",
//       description:
//         "Suivez en direct les résultats, le classement et les statistiques du championnat de football amateur Match Champions.",
//       type: "website",
//       locale: "fr_FR",
//       images: [
//         {
//           url: ogImageUrl,
//           width: 1200,
//           height: 630,
//           alt: "Match Champions - Championnat de Football Amateur",
//         },
//       ],
//     },
//   };
// }

export default async function Home() {
  const { success: seasonSuccess, season: fetchedSeason } =
    await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();
  const seasonName = seasonSuccess && fetchedSeason ? fetchedSeason.name : "";

  // Filter teams participating in current season
  const participatingTeams =
    teamsSuccess && teams && fetchedSeason
      ? teams.filter((team) => team.seasons.includes(fetchedSeason.id))
      : [];

  // Convert season for standings calculation if needed
  let standings: Standing[] = [];
  if (seasonSuccess && fetchedSeason && teamsSuccess && teams) {
    standings = calculateStandings(fetchedSeason, teams);
  }

  return (
    <main className="min-h-screen px-4 md:px-8">
      <Hero
        seasonName={seasonName}
        season={fetchedSeason}
        participatingTeams={participatingTeams}
      />
      <UpcomingMatches season={fetchedSeason} />
      {teams && standings.length > 0 && (
        <StandingsTable standings={standings} teams={teams} />
      )}
    </main>
  );
}
