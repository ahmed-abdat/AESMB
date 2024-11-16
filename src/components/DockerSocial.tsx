import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconBrandFacebook, IconBrandWhatsapp } from "@tabler/icons-react";

export function DockerSocial() {
  const links = [
    {
      title: "Facebook",
      icon: (
        <IconBrandFacebook className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://web.facebook.com/profile.php?id=61562947143718",
    },
    {
      title: "WhatsApp",
      icon: (
        <IconBrandWhatsapp className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "https://www.whatsapp.com",
    },
  ];

  return (
    <div className="flex items-center justify-center mt-8 w-full">
      <FloatingDock
        items={links}
      />
    </div>
  );
}
