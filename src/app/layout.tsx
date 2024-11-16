import { tajawal, roboto } from "@/app/font/font";
import { Toaster } from "sonner";
import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  metadataBase: new URL('https://aesmb.vercel.app/'),
  title: 'Ligue AESMB - Championnat de Football',
  description: 'Suivez le championnat de football AESMB. Classements en direct, gestion des équipes et calendrier des matchs.',
  keywords: 'AESMB, football, championnat, tournoi, classement, matchs',
  authors: [{ name: 'AESMB' }],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: '/',
    title: 'Ligue AESMB - Championnat de Football',
    description: 'Suivez le championnat de football AESMB. Classements en direct, gestion des équipes et calendrier des matchs.',
    siteName: 'Ligue AESMB',
    images: [
      {
        url: '/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Ligue AESMB Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ligue AESMB - Championnat de Football',
    description: 'Suivez le championnat de football AESMB. Classements en direct, gestion des équipes et calendrier des matchs.',
    images: ['/logo.jpg'],
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
