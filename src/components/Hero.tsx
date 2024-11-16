'use client';

import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { IconCalendarStats, IconTrophy } from '@tabler/icons-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="pt-24 pb-8 md:pt-32 md:pb-12">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6"
        >
          <div className="space-y-2">
            <h2 className="text-primary font-semibold">Saison 2024-2025</h2>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Ligue AESMB
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Tournois des Clubs
            </p>
          </div>
          
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Suivez 5 clubs qui s&apos;affrontent sur 5 tours dans le tournoi de football le plus passionnant.
            Restez à jour avec les matchs, les classements et les résultats.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/schedule">
              <Button size="lg" className="gap-2 w-full sm:w-auto">
                <IconCalendarStats className="w-5 h-5" />
                Calendrier
              </Button>
            </Link>
            <Link href="/standings">
              <Button size="lg" variant="outline" className="gap-2 w-full sm:w-auto">
                <IconTrophy className="w-5 h-5" />
                Classement
              </Button>
            </Link>
          </div>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              Prochain Tour: 16 Novembre 2024 • 5 Clubs • 5 Tours • 20 Matchs
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 