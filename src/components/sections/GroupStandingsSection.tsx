'use client';

import { motion } from 'framer-motion';
import { GroupStandings } from '../standings/GroupStandings';

const groupAStandings = [
  { position: 1, team: "Barcelona", played: 6, won: 5, drawn: 1, lost: 0, gf: 15, ga: 3, gd: 12, points: 16 },
  { position: 2, team: "Real Madrid", played: 6, won: 4, drawn: 1, lost: 1, gf: 12, ga: 5, gd: 7, points: 13 },
  { position: 3, team: "Atletico", played: 6, won: 2, drawn: 2, lost: 2, gf: 8, ga: 7, gd: 1, points: 8 },
  { position: 4, team: "Sevilla", played: 6, won: 0, drawn: 0, lost: 6, gf: 3, ga: 15, gd: -12, points: 0 },
];

const groupBStandings = [
  { position: 1, team: "Man City", played: 6, won: 6, drawn: 0, lost: 0, gf: 18, ga: 4, gd: 14, points: 18 },
  { position: 2, team: "Liverpool", played: 6, won: 3, drawn: 2, lost: 1, gf: 11, ga: 6, gd: 5, points: 11 },
  { position: 3, team: "Arsenal", played: 6, won: 2, drawn: 1, lost: 3, gf: 7, ga: 9, gd: -2, points: 7 },
  { position: 4, team: "Chelsea", played: 6, won: 0, drawn: 1, lost: 5, gf: 4, ga: 15, gd: -11, points: 1 },
];

export function GroupStandingsSection() {
  return (
    <section className="py-12 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-6">Group Standings</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GroupStandings groupName="A" standings={groupAStandings} />
            <GroupStandings groupName="B" standings={groupBStandings} />
          </div>
        </motion.div>
      </div>
    </section>
  );
} 