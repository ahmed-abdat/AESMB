import { tajawal, roboto } from "@/app/font/font";
import { Toaster } from "sonner";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import { SplashScreen } from "@/components/SplashScreen";

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: "Ligue AESMB - Championnat de Football",
  description:
    "Suivez le championnat de football AESMB. Classements en direct, gestion des équipes et calendrier des matchs.",
  keywords: "AESMB, football, championnat, tournoi, classement, matchs",
  authors: [{ name: "AESMB" }],
  manifest: "/manifest.json",
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: [
      { url: '/icons/apple-icon-180.png', sizes: '180x180', type: 'image/png' },
      { url: '/icons/apple-icon-152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icons/apple-icon-167.png', sizes: '167x167', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Match Champions",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    title: "Ligue AESMB - Championnat de Football",
    description:
      "Suivez le championnat de football AESMB. Classements en direct, gestion des équipes et calendrier des matchs.",
    siteName: "Ligue AESMB",
    images: [
      {
        url: "/logo.jpg",
        width: 1200,
        height: 630,
        alt: "Ligue AESMB Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ligue AESMB - Championnat de Football",
    description:
      "Suivez le championnat de football AESMB. Classements en direct, gestion des équipes et calendrier des matchs.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Match Champions" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Match Champions" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS icons */}
        <link rel="apple-touch-icon" href="/icons/apple-icon-180.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/apple-icon-152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-icon-180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/apple-icon-167.png"
        />

        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />

        {/* Windows */}
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="msapplication-TileImage" content="/icons/icon-192.png" />
      </head>
      <body className={`${tajawal.variable} ${roboto.variable} font-sans`}>
        <Header />
        {children}
        <Toaster position="top-center" richColors />
        <PWAInstallPrompt />
        <SplashScreen />
      </body>
    </html>
  );
}
