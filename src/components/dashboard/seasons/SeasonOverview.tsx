"use client";

import { useEffect, useState } from "react";
import { Season } from "@/types/season";
import { Team } from "@/types/team";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { IconCalendar, IconTrophy, IconUsers } from "@tabler/icons-react";
import { getSeasonTeams } from "@/app/actions/seasons";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

interface SeasonOverviewProps {
  season: Season;
}

export function SeasonOverview({ season }: SeasonOverviewProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const statusColors = {
    upcoming: "bg-blue-500/10 text-blue-500",
    ongoing: "bg-green-500/10 text-green-500",
    completed: "bg-orange-500/10 text-orange-500",
  };

  const statusLabels = {
    upcoming: "À venir",
    ongoing: "En cours",
    completed: "Terminé",
  };

  useEffect(() => {
    const fetchTeams = async () => {
      const result = await getSeasonTeams(season.id);
      if (result.success && result.teams) {
        setTeams(result.teams);
      } else {
        toast.error(result.error?.message || "Erreur lors du chargement des équipes");
      }
      setLoading(false);
    };

    fetchTeams();
  }, [season.id]);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="secondary" className={statusColors[season.status]}>
              {statusLabels[season.status]}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Dates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconCalendar className="h-4 w-4" />
              <span>
                {format(season.startDate, "d MMMM yyyy", { locale: fr })} -{" "}
                {format(season.endDate, "d MMMM yyyy", { locale: fr })}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Points</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-muted-foreground">
              <IconTrophy className="h-4 w-4" />
              <span>
                Victoire: {season.pointsSystem.win} / Match nul:{" "}
                {season.pointsSystem.draw} / Défaite: {season.pointsSystem.loss}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Équipes Participantes</h3>
            <p className="text-sm text-muted-foreground">
              {teams.length} équipes inscrites dans cette saison
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Link
              key={team.id}
              href={`/dashboard/teams/${team.id}`}
              className="block"
            >
              <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="relative w-10 h-10">
                      <Image
                        src={team.logo}
                        alt={team.name}
                        fill
                        sizes="(max-width: 40px) 100vw, 40px"
                        className="object-contain"
                      />
                    </div>
                    <span>{team.name}</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 