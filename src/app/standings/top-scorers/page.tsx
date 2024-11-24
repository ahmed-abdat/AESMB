import { getCurrentSeason } from "@/app/actions/seasons";
import { getTeams } from "@/app/actions/teams";
import { IconTarget } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";
export const revalidate = 60;

export default async function TopScorersPage() {
  const { success: seasonSuccess, season } = await getCurrentSeason();
  const { success: teamsSuccess, teams } = await getTeams();

  if (!seasonSuccess || !season || !teamsSuccess || !teams) {
    return (
      <main className="min-h-screen pt-16">
        <div className="px-4 md:px-8">
          <h1 className="text-2xl md:text-3xl font-bold">Données non disponibles</h1>
        </div>
      </main>
    );
  }

  // Get all players and their stats
  const players = teams.flatMap(team => 
    team.members.map(member => ({
      ...member,
      teamName: team.name,
    }))
  ).sort((a, b) => b.stats.goals - a.stats.goals);

  return (
    <main className="min-h-screen pt-16">
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex h-16 md:h-20 items-center px-4 md:px-8">
          <div className="flex items-center gap-2 font-bold">
            <IconTarget className="h-5 w-5 md:h-6 md:w-6" />
            <h1 className="text-lg md:text-2xl">Classement des Buteurs</h1>
          </div>
          <span className="ml-auto text-sm md:text-base text-muted-foreground">
            Saison {season.name}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-6">
        <Link href="/standings">
          <Button variant="ghost" size="sm" className="gap-2">
            <IconArrowLeft className="w-4 h-4" />
            Retour au classement
          </Button>
        </Link>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Pos</TableHead>
                  <TableHead>Joueur</TableHead>
                  <TableHead>Équipe</TableHead>
                  <TableHead className="text-center">Buts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((player, index) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>{player.teamName}</TableCell>
                    <TableCell className="text-center">{player.stats.goals}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 