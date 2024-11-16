"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";
import { Season } from "@/types/season";
import { convertFirestoreDataToSeason } from "@/types/season";
import { SeasonsSection } from "@/components/dashboard/seasons/SeasonsSection";
import { LoadingScreen } from "@/components/LoadingScreen";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconArrowLeft } from "@tabler/icons-react";

export default function SeasonsPage() {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSeasons = async () => {
    try {
      const seasonsRef = collection(db, "seasons");
      const seasonsQuery = query(seasonsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(seasonsQuery);
      
      const seasonsData = querySnapshot.docs.map((doc) => 
        convertFirestoreDataToSeason(doc.id, doc.data())
      );

      setSeasons(seasonsData);
    } catch (error) {
      console.error("Error fetching seasons:", error);
      toast.error("Erreur lors du chargement des saisons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="gap-2">
              <IconArrowLeft className="w-4 h-4" />
              Retour
            </Button>
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <SeasonsSection seasons={seasons} onUpdate={fetchSeasons} />
      </motion.div>
    </div>
  );
} 