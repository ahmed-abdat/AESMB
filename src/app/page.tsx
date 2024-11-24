import { Hero } from '@/components/Hero';
import { UpcomingMatches } from '@/components/sections/UpcomingMatches';
import { StandingsTable } from '@/components/sections/StandingsTable';
import { getCurrentSeason } from './actions/seasons';
import { getTeams } from './actions/teams';
import { calculateStandings } from '@/lib/standings';
import { Standing } from '@/types/season';

export const revalidate = 60;

export default async function Home() {
  const { success: seasonSuccess, season: fetchedSeason } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();
  const seasonName = seasonSuccess && fetchedSeason ? fetchedSeason.name : '';

  // Convert season for standings calculation if needed
  let standings: Standing[] = [];
  if (seasonSuccess && fetchedSeason && teamsSuccess && teams) {
    standings = calculateStandings(fetchedSeason, teams);
  }

  return (
    <main className="min-h-screen px-4 md:px-8">
      <Hero seasonName={seasonName} season={fetchedSeason} />
      <UpcomingMatches season={fetchedSeason} />
      {teams && standings.length > 0 && (
        <StandingsTable standings={standings} teams={teams} />
      )}
    </main>
  );
}
