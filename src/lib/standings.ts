import { Season, TeamStats, Standing } from "@/types/season";
import { Team } from "@/types/team";

export function calculateStandings(season: Season, teams: Team[]): Standing[] {
  // Initialize stats for all teams
  const teamStats: { [key: string]: TeamStats } = {};
  
  // Initialize stats for each team
  teams.forEach(team => {
    teamStats[team.id] = {
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
    };
  });

  // Calculate stats from matches
  season.rounds.forEach(round => {
    round.matches.forEach(match => {
      // Only count completed matches
      if (match.status === 'completed' && match.result) {
        const homeTeamStats = teamStats[match.homeTeamId];
        const awayTeamStats = teamStats[match.awayTeamId];

        if (homeTeamStats && awayTeamStats) {
          // Update matches played
          homeTeamStats.played++;
          awayTeamStats.played++;

          // Update goals
          homeTeamStats.goalsFor += match.result.homeScore;
          homeTeamStats.goalsAgainst += match.result.awayScore;
          awayTeamStats.goalsFor += match.result.awayScore;
          awayTeamStats.goalsAgainst += match.result.homeScore;

          // Update goal difference
          homeTeamStats.goalDifference = homeTeamStats.goalsFor - homeTeamStats.goalsAgainst;
          awayTeamStats.goalDifference = awayTeamStats.goalsFor - awayTeamStats.goalsAgainst;

          // Determine match outcome and update points
          if (match.result.homeScore > match.result.awayScore) {
            // Home team won
            homeTeamStats.won++;
            homeTeamStats.points += season.pointsSystem.win;
            awayTeamStats.lost++;
            homeTeamStats.form.push('W');
            awayTeamStats.form.push('L');
          } else if (match.result.homeScore < match.result.awayScore) {
            // Away team won
            awayTeamStats.won++;
            awayTeamStats.points += season.pointsSystem.win;
            homeTeamStats.lost++;
            homeTeamStats.form.push('L');
            awayTeamStats.form.push('W');
          } else {
            // Draw
            homeTeamStats.drawn++;
            awayTeamStats.drawn++;
            homeTeamStats.points += season.pointsSystem.draw;
            awayTeamStats.points += season.pointsSystem.draw;
            homeTeamStats.form.push('D');
            awayTeamStats.form.push('D');
          }
        }
      }
    });
  });

  // Convert to array and sort
  const standings = Object.values(teamStats)
    .map((stats, index) => ({
      stats,
      position: index + 1,
    }))
    .sort((a, b) => {
      // Sort by points
      if (b.stats.points !== a.stats.points) {
        return b.stats.points - a.stats.points;
      }
      // If points are equal, sort by goal difference
      if (b.stats.goalDifference !== a.stats.goalDifference) {
        return b.stats.goalDifference - a.stats.goalDifference;
      }
      // If goal difference is equal, sort by goals scored
      return b.stats.goalsFor - a.stats.goalsFor;
    });

  // Update positions after sorting
  standings.forEach((standing, index) => {
    standing.position = index + 1;
  });

  return standings;
} 