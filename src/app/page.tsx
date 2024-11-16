import { Hero } from '@/components/Hero';
import { UpcomingMatches } from '@/components/sections/UpcomingMatches';
import { StandingsTable } from '@/components/sections/StandingsTable';

export default function Home() {
  return (
    <main className="min-h-screen px-4 md:px-8">
      <Hero />
      <UpcomingMatches />
      <StandingsTable />
    </main>
  );
}
