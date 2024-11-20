import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Team } from "@/types/team";
import { SeasonFirestore } from "@/types/season";

interface StatsCardsProps {
  season: SeasonFirestore;
  teams: Team[];
}

// Helper function to calculate tournament stats
function calculateTournamentStats(season: SeasonFirestore) {
  let totalGoals = 0;
  let cleanSheets = new Map<string, number>();
  let totalCompletedMatches = 0;

  season.rounds.forEach((round) => {
    round.matches.forEach((match) => {
      if (match.status === 'completed' && match.result) {
        totalCompletedMatches++;
        totalGoals += match.result.homeScore + match.result.awayScore;

        if (match.result.awayScore === 0) {
          const homeCount = cleanSheets.get(match.homeTeamId) || 0;
          cleanSheets.set(match.homeTeamId, homeCount + 1);
        }
        if (match.result.homeScore === 0) {
          const awayCount = cleanSheets.get(match.awayTeamId) || 0;
          cleanSheets.set(match.awayTeamId, awayCount + 1);
        }
      }
    });
  });

  let mostCleanSheets = { teamId: '', count: 0 };
  cleanSheets.forEach((count, teamId) => {
    if (count > mostCleanSheets.count) {
      mostCleanSheets = { teamId, count };
    }
  });

  return {
    totalMatches: totalCompletedMatches,
    totalGoals,
    mostCleanSheets
  };
}

export function StatsCards({ season, teams }: StatsCardsProps) {
  const stats = calculateTournamentStats(season);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Matchs Joués
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalMatches}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total des Buts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.totalGoals}
          </div>
          <div className="text-sm text-muted-foreground">
            {(stats.totalGoals / (stats.totalMatches || 1)).toFixed(2)} buts par match
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Matchs Sans Encaisser
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.mostCleanSheets.count}
          </div>
          <div className="text-sm text-muted-foreground">
            {teams.find(t => t.id === stats.mostCleanSheets.teamId)?.name || ''}
            {stats.mostCleanSheets.count > 0 && (
              <span className="block text-xs">
                Meilleure défense du championnat
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 