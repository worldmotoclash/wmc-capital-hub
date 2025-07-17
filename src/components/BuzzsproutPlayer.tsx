import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { trackDocumentClick } from '@/services/loginService';
import { TRACKING_ACTIONS } from '@/constants/trackingActions';
import { Button } from '@/components/ui/button';

interface BuzzsproutPlayerProps {
  embedCode: string;
  title: string;
  documentUrl: string;
  className?: string;
}

const BuzzsproutPlayer: React.FC<BuzzsproutPlayerProps> = ({ 
  embedCode, 
  title, 
  documentUrl, 
  className = '' 
}) => {
  const { user } = useUser();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);

  // Manual tracking function for fallback button
  const handleManualTrack = async () => {
    if (!user?.id) return;
    
    console.log('[BuzzsproutPlayer] Manual track button clicked');
    try {
      await trackDocumentClick(
        user.id,
        documentUrl,
        TRACKING_ACTIONS.AUDIO_CLICKED,
        title
      );
      console.log('[BuzzsproutPlayer] Manual audio tracking completed');
    } catch (error) {
      console.error('[BuzzsproutPlayer] Error in manual tracking:', error);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;

    console.log('[BuzzsproutPlayer] Loading player for:', title);
    
    // Clear any existing content
    containerRef.current.innerHTML = '';

    // Create a temporary div to parse the embed code
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = embedCode;

    // Extract the script elements and container div
    const scriptElements = tempDiv.querySelectorAll('script');
    const containerDiv = tempDiv.querySelector('div');

    if (containerDiv) {
      // Add the container div
      containerRef.current.appendChild(containerDiv.cloneNode(true));
    }

    // Add script elements
    scriptElements.forEach(script => {
      const newScript = document.createElement('script');
      if (script.src) {
        newScript.src = script.src;
        newScript.onload = () => {
          console.log('[BuzzsproutPlayer] Script loaded, player should be ready');
          setIsPlayerLoaded(true);
        };
      }
      if (script.innerHTML) {
        newScript.innerHTML = script.innerHTML;
      }
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      containerRef.current?.appendChild(newScript);
    });

    // Enhanced click tracking
    const handlePlayerClick = async (event: Event) => {
      if (!user?.id) return;
      
      console.log('[BuzzsproutPlayer] Player interaction detected:', event.type);
      console.log('[BuzzsproutPlayer] Target element:', event.target);
      
      try {
        await trackDocumentClick(
          user.id,
          documentUrl,
          TRACKING_ACTIONS.AUDIO_CLICKED,
          title
        );
        console.log('[BuzzsproutPlayer] Audio tracking completed successfully');
      } catch (error) {
        console.error('[BuzzsproutPlayer] Error tracking audio:', error);
      }
    };

    // Add event listener for clicks on the container
    const container = containerRef.current;
    if (container) {
      // Add multiple event types for better detection
      container.addEventListener('click', handlePlayerClick);
      container.addEventListener('mousedown', handlePlayerClick);
      
      // Enhanced player button detection with MutationObserver
      const observer = new MutationObserver(() => {
        const playerButtons = container.querySelectorAll(
          'button, [role="button"], .spp-player-button, .buzzsprout-track, .play-button, [class*="play"], [class*="button"]'
        );
        
        console.log('[BuzzsproutPlayer] Found', playerButtons.length, 'potential player buttons');
        
        playerButtons.forEach((button, index) => {
          console.log(`[BuzzsproutPlayer] Button ${index}:`, button.className, button.getAttribute('role'));
          button.addEventListener('click', handlePlayerClick);
          button.addEventListener('mousedown', handlePlayerClick);
        });
      });

      // Start observing
      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true
      });

      // Also check periodically with higher frequency
      let checkCount = 0;
      const maxChecks = 40; // 10 seconds at 250ms intervals
      
      const interval = setInterval(() => {
        checkCount++;
        
        const playerElements = container.querySelectorAll(
          'button, [role="button"], .spp-player-button, .buzzsprout-track, [class*="play"], [class*="button"]'
        );
        
        if (playerElements.length > 0) {
          console.log('[BuzzsproutPlayer] Found player elements on check', checkCount, ':', playerElements.length);
          playerElements.forEach(element => {
            element.addEventListener('click', handlePlayerClick);
            element.addEventListener('mousedown', handlePlayerClick);
          });
        }
        
        if (checkCount >= maxChecks) {
          console.log('[BuzzsproutPlayer] Stopped checking for player buttons after', maxChecks, 'attempts');
          clearInterval(interval);
        }
      }, 250);
      
      // Cleanup
      return () => {
        observer.disconnect();
        container.removeEventListener('click', handlePlayerClick);
        container.removeEventListener('mousedown', handlePlayerClick);
        clearInterval(interval);
      };
    }
  }, [embedCode, user, documentUrl, title]);

  return (
    <div className={`buzzsprout-player-container ${className}`}>
      <div ref={containerRef} className="w-full" />
      <div className="mt-2 flex justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualTrack}
          className="text-xs"
        >
          🎧 Track Podcast Listen
        </Button>
      </div>
    </div>
  );
};

export default BuzzsproutPlayer;