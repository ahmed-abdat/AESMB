'use client';

import Link from 'next/link';
import { IconMenu2 } from '@tabler/icons-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from './ui/button';
import { useState } from 'react';
import Image from 'next/image';

const menuItems = [
  { href: '/schedule', label: 'Calendrier' },
  { href: '/statistics', label: 'Statistiques' },
  { href: '/standings', label: 'Classement' },
  { href: '/groups', label: 'Équipes' },
  { href: '/results', label: 'Résultats' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center justify-center hover:opacity-90">
          <div className="relative w-16 h-16 flex">
            <Image
              src="/logo.jpg"
              alt="AESMB Logo"
              width={64}
              height={64}
              priority
              className="object-contain"
            />
          </div>
          <span className="text-xl font-bold">AESMB</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <IconMenu2 className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
            <nav className="flex flex-col h-full bg-background">
              <div className="px-6 py-4 border-b">
                <Link 
                  href="/" 
                  className="flex items-center gap-2"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="relative w-6 h-6">
                    <Image
                      src="/logo.jpg"
                      alt="AESMB Logo"
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-lg font-bold">AESMB</span>
                </Link>
              </div>
              <div className="flex-1 px-6 py-4">
                <div className="flex flex-col space-y-3">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center py-2 text-lg font-medium hover:text-primary transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="px-6 py-4 border-t">
                <p className="text-sm text-muted-foreground">
                  © 2024 AESMB. Tous droits réservés.
                </p>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
} 