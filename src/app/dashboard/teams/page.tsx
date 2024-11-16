"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Team, convertFirestoreDataToTeam } from "@/types/team";
import { TeamsSection } from "@/components/dashboard/teams/TeamsSection";
import { LoadingScreen } from "@/components/LoadingScreen";
import { toast } from "sonner";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeams = async () => {
    try {
      const teamsRef = collection(db, "teams");
      const teamsQuery = query(teamsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(teamsQuery);

      const teamsData = querySnapshot.docs.map((doc) =>
        convertFirestoreDataToTeam(doc.id, doc.data())
      );

      setTeams(teamsData);
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Erreur lors du chargement des équipes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        <TeamsSection teams={teams} onUpdate={fetchTeams} />
      </motion.div>
    </main>
  );
}
