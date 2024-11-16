import { tajawal, roboto } from "@/app/font/font";
import { Toaster } from "sonner";
import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: 'TourneyTracker - Football Tournament Management',
  description: 'Track and manage your football tournaments with ease. Real-time standings, team management, and match scheduling.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body className={`${roboto.className} ${tajawal.className} min-h-screen`}>
        <Header />  
        {children}
        <Toaster position="top-center" richColors dir="ltr" />
      </body>
    </html>
  );
}
