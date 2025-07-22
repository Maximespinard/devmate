import { useEffect } from 'react';
import { ToolContainer } from '@/shared/components/layout';
import { ToolHeader } from '@/shared/components/common';
import { Button } from '@/shared/components/ui/button';

export default function OfflinePage() {
  useEffect(() => {
    // Try to reconnect every 5 seconds
    const interval = setInterval(() => {
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRetry = (): void => {
    window.location.reload();
  };

  return (
    <ToolContainer className="text-center">
      <ToolHeader 
        title="You're Offline" 
        description="DevMate requires an internet connection to function properly" 
      />
      
      <div className="glass-panel p-8 max-w-md mx-auto space-y-6">
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
            <span className="text-2xl">📡</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Please check your internet connection and try again.
            </p>
            <p className="text-sm text-muted-foreground/60">
              We'll automatically refresh when you're back online.
            </p>
          </div>
        </div>

        <Button 
          onClick={handleRetry}
          className="w-full"
          variant="default"
        >
          Try Again
        </Button>

        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Network Status: {navigator.onLine ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>
    </ToolContainer>
  );
}