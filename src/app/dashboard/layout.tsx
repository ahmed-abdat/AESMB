"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { auth } from "@/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { IconLogout, IconHome, IconUsers, IconCalendar } from "@tabler/icons-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { cn } from "@/lib/utils";
import { Header } from "@/components/Header";

const navigationItems = [
  {
    name: "Accueil",
    href: "/dashboard",
    icon: IconHome,
  },
  {
    name: "Équipes",
    href: "/dashboard/teams",
    icon: IconUsers,
  },
  {
    name: "Saisons",
    href: "/dashboard/seasons",
    icon: IconCalendar,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user && pathname !== "/dashboard/login") {
        router.push("/dashboard/login");
      } else if (user && pathname === "/dashboard/login") {
        router.push("/dashboard");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [pathname, router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/dashboard/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (pathname === "/dashboard/login") {
    return (
      <>
        <Header />
        <div className="pt-16">{children}</div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-16">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-background">
          <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-4">
              <h1 className="text-lg font-bold">Administration</h1>
            </div>
            <nav className="flex-1 space-y-1 p-4">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t p-4">
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleLogout}
              >
                <IconLogout className="h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="pl-64">
          <div className="min-h-[calc(100vh-4rem)] p-8">{children}</div>
        </main>
      </div>
    </>
  );
} 