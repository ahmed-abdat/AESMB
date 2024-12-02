'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { IconDeviceMobile, IconX } from '@tabler/icons-react';

const STORAGE_KEY = 'pwa-install-prompt-dismissed';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isInstalled) return;

    // Check if user has dismissed the prompt in this session
    const isDismissed = sessionStorage.getItem(STORAGE_KEY) === 'true';
    if (isDismissed) return;

    const handler = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      // Show our custom prompt after a short delay to let the page load
      setTimeout(() => {
        setShowPrompt(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        // Clear session storage since the app is now installed
        sessionStorage.removeItem(STORAGE_KEY);
      } else {
        console.log('User dismissed the install prompt');
        handleDismiss();
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    } finally {
      // Clear the deferredPrompt for the next time
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    // Store dismissal only in session storage (cleared when browser is closed)
    sessionStorage.setItem(STORAGE_KEY, 'true');
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-background border rounded-lg shadow-lg p-4 z-50 animate-in slide-in-from-bottom-5">
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
          className="h-6 w-6 hover:bg-muted/50"
          onClick={handleDismiss}
        >
          <IconX className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-4 flex gap-2">
        <Button
          variant="default"
          className="flex-1 font-medium"
          onClick={handleInstallClick}
        >
          Installer
        </Button>
        <Button
          variant="outline"
          className="flex-1 font-medium"
          onClick={handleDismiss}
        >
          Plus tard
        </Button>
      </div>
    </div>
  );
} 