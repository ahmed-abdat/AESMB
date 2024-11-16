"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconUsers, IconCalendar, IconTrophy } from "@tabler/icons-react";
import { db } from "@/config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { LoadingScreen } from "@/components/LoadingScreen";
import Link from "next/link";

interface DashboardStats {
  totalTeams: number;
  totalSeasons: number;
  activeSeasons: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalTeams: 0,
    totalSeasons: 0,
    activeSeasons: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      // Get total teams
      const teamsSnapshot = await getDocs(collection(db, "teams"));
      const totalTeams = teamsSnapshot.size;

      // Get seasons
      const seasonsSnapshot = await getDocs(collection(db, "seasons"));
      const totalSeasons = seasonsSnapshot.size;

      // Get active seasons
      const activeSeasonsSnapshot = await getDocs(
        query(collection(db, "seasons"), where("status", "==", "ongoing"))
      );
      const activeSeasons = activeSeasonsSnapshot.size;

      setStats({
        totalTeams,
        totalSeasons,
        activeSeasons,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tableau de Bord</h1>
        <p className="text-muted-foreground">
          Bienvenue dans l'interface d'administration de AESMB League
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/teams">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total des Équipes
              </CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalTeams}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/seasons">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total des Saisons
              </CardTitle>
              <IconCalendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSeasons}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/seasons">
          <Card className="hover:bg-muted/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Saisons en Cours
              </CardTitle>
              <IconTrophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeSeasons}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Add more sections here as needed */}
    </div>
  );
} 