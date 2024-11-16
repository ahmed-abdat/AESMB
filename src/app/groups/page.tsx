"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { IconTrophy, IconUsers } from "@tabler/icons-react";
import { clubs } from "@/types/tournament-data";

// Sample data for round progress
const roundProgress = {
  currentRound: 1,
  totalRounds: 5,
  matchesPlayed: 4,
  totalMatches: 20,
  topScorer: "Player Name (Team) - 3 goals",
};

export default function GroupsPage() {
  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tournament Overview</h1>
          <div className="text-sm text-muted-foreground">
            Round {roundProgress.currentRound} of {roundProgress.totalRounds}
          </div>
        </div>

        {/* Tournament Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Tournament Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Matches Played
                  </p>
                  <p className="text-2xl font-bold">
                    {roundProgress.matchesPlayed} / {roundProgress.totalMatches}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Round</p>
                  <p className="text-2xl font-bold">
                    {roundProgress.currentRound}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Scorer</p>
                  <p className="text-lg font-medium">
                    {roundProgress.topScorer}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Teams Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {clubs.map((club) => (
            <Link key={club.id} href={`/standings#${club.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{club.name}</span>
                    <IconUsers className="w-5 h-5 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative w-32 h-32 mx-auto">
                      <Image
                        src={club.logo}
                        alt={club.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Next Match: Round {roundProgress.currentRound + 1}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </motion.div>
      </div>
    </main>
  );
}
