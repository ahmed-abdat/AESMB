import { Hero } from '@/components/Hero';
import { UpcomingMatches } from '@/components/sections/UpcomingMatches';
import { StandingsTable } from '@/components/sections/StandingsTable';
import { getCurrentSeason } from './actions/seasons';
import { getTeams } from './actions/teams';
import { calculateStandings } from '@/lib/standings';
import { Standing } from '@/types/season';
import { NEXT_REVALIDATE_TIME } from '@/constants/next_revalidat_time';

export const revalidate = NEXT_REVALIDATE_TIME;

export default async function Home() {
  const { success: seasonSuccess, season: fetchedSeason } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();
  const seasonName = seasonSuccess && fetchedSeason ? fetchedSeason.name : '';

  // Filter teams participating in current season
  const participatingTeams = teamsSuccess && teams && fetchedSeason 
    ? teams.filter(team => team.seasons.includes(fetchedSeason.id))
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
