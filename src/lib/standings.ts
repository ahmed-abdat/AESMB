import { Season, Match, TeamStats, Standing } from "@/types/season";
import { Team } from "@/types/team";

export function calculateStandings(season: Season, teams: Team[]): Standing[] {
  // Initialize team stats
  const teamStats = new Map<string, TeamStats>();

  teams.forEach(team => {
    teamStats.set(team.id, {
      teamId: team.id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      points: 0,
      form: [],
    });
  });

  // Calculate stats from matches
  season.rounds.forEach(round => {
    round.matches.forEach(match => {
      if (match.result && match.result.status === 'completed') {
        const homeStats = teamStats.get(match.homeTeamId);
        const awayStats = teamStats.get(match.awayTeamId);

        if (homeStats && awayStats) {
          // Update matches played
          homeStats.played++;
          awayStats.played++;

          // Update goals
          const homeScore = match.result.homeScore;
          const awayScore = match.result.awayScore;
          
          homeStats.goalsFor += homeScore;
          homeStats.goalsAgainst += awayScore;
          awayStats.goalsFor += awayScore;
          awayStats.goalsAgainst += homeScore;

          // Update goal difference
          homeStats.goalDifference = homeStats.goalsFor - homeStats.goalsAgainst;
          awayStats.goalDifference = awayStats.goalsFor - awayStats.goalsAgainst;

          // Update wins, draws, losses and points based on the result
          if (homeScore > awayScore) {
            // Home team wins
            homeStats.won++;
            awayStats.lost++;
            homeStats.points += season.pointsSystem.win;
            awayStats.points += season.pointsSystem.loss;
            homeStats.form.push('W');
            awayStats.form.push('L');
          } else if (homeScore < awayScore) {
            // Away team wins
            homeStats.lost++;
            awayStats.won++;
            homeStats.points += season.pointsSystem.loss;
            awayStats.points += season.pointsSystem.win;
            homeStats.form.push('L');
            awayStats.form.push('W');
          } else {
            // Draw
            homeStats.drawn++;
            awayStats.drawn++;
            homeStats.points += season.pointsSystem.draw;
            awayStats.points += season.pointsSystem.draw;
            homeStats.form.push('D');
            awayStats.form.push('D');
          }

          // Keep only last 5 matches in form
          homeStats.form = homeStats.form.slice(-5);
          awayStats.form = awayStats.form.slice(-5);
        }
      }
    });
  });

  // Convert to array and sort
  const standings = Array.from(teamStats.values()).map((stats) => ({
    stats,
    position: 0, // Will be set after sorting
  }));

  // Sort by:
  // 1. Points (highest first)
  // 2. Goal difference (highest first)
  // 3. Goals scored (highest first)
  // 4. Head-to-head results (if needed)
  standings.sort((a, b) => {
    // Points comparison
    if (b.stats.points !== a.stats.points) {
      return b.stats.points - a.stats.points;
    }

    // Goal difference comparison
    if (b.stats.goalDifference !== a.stats.goalDifference) {
      return b.stats.goalDifference - a.stats.goalDifference;
    }

    // Goals scored comparison
    if (b.stats.goalsFor !== a.stats.goalsFor) {
      return b.stats.goalsFor - a.stats.goalsFor;
    }

    // If everything is equal, maintain stable sort
    return 0;
  });

  // Update positions after sorting
  standings.forEach((standing, index) => {
    standing.position = index + 1;
  });

  return standings;
} 