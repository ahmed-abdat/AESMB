'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconDeviceMobile, IconX } from '@tabler/icons-react';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) return;

    const handler = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom prompt
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferredPrompt for the next time
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background border rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <IconDeviceMobile className="h-6 w-6 text-primary" />
          <div>
            <h3 className="font-semibold">Installer l&apos;application</h3>
            <p className="text-sm text-muted-foreground">
              Installez Match Champions pour un accès rapide et hors ligne
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setShowPrompt(false)}
        >
          <IconX className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          variant="default"
          className="flex-1"
          onClick={handleInstallClick}
        >
          Installer
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => setShowPrompt(false)}
        >
          Plus tard
        </Button>
      </div>
    </div>
  );
} 