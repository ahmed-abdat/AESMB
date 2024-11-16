import { tajawal, roboto } from "@/app/font/font";
import { Toaster } from "sonner";
import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: 'Ligue AESMB - Championnat de Football',
  description: 'Suivez le championnat de football AESMB. Classements en direct, gestion des équipes et calendrier des matchs.',
  keywords: 'AESMB, football, championnat, tournoi, classement, matchs',
  authors: [{ name: 'AESMB' }],
  openGraph: {
    title: 'Ligue AESMB - Championnat de Football',
    description: 'Suivez le championnat de football AESMB. Classements en direct, gestion des équipes et calendrier des matchs.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${roboto.className} ${tajawal.className} min-h-screen`}>
        <Header />  
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton
          toastOptions={{
            style: { background: 'var(--background)', color: 'var(--foreground)' },
          }}
        />
      </body>
    </html>
  );
}
