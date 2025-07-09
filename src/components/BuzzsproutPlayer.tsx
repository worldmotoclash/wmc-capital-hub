import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { trackDocumentClick } from '@/services/loginService';

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
  const [hasTracked, setHasTracked] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

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
      }
      if (script.innerHTML) {
        newScript.innerHTML = script.innerHTML;
      }
      Array.from(script.attributes).forEach(attr => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      containerRef.current?.appendChild(newScript);
    });

    // Add click tracking to the container
    const handlePlayerClick = async () => {
      if (!hasTracked && user?.id) {
        console.log('[BuzzsproutPlayer] Audio player clicked, tracking...');
        setHasTracked(true);
        
        try {
          await trackDocumentClick(
            user.id,
            documentUrl,
            'Audio Clicked',
            title
          );
          console.log('[BuzzsproutPlayer] Audio tracking completed');
        } catch (error) {
          console.error('[BuzzsproutPlayer] Error tracking audio:', error);
          setHasTracked(false); // Reset on error
        }
      }
    };

    // Add event listener for clicks on the container
    const container = containerRef.current;
    if (container) {
      container.addEventListener('click', handlePlayerClick);
      
      // Also try to detect when the player loads and add listeners to buttons
      const checkForPlayer = () => {
        const playButton = container.querySelector('button, [role="button"], .spp-player-button');
        if (playButton) {
          playButton.addEventListener('click', handlePlayerClick);
        }
      };
      
      // Check periodically for player buttons
      const interval = setInterval(checkForPlayer, 1000);
      
      // Cleanup
      return () => {
        container.removeEventListener('click', handlePlayerClick);
        clearInterval(interval);
      };
    }
  }, [embedCode, user, documentUrl, title, hasTracked]);

  return (
    <div className={`buzzsprout-player-container ${className}`}>
      <div ref={containerRef} className="w-full" />
    </div>
  );
};

export default BuzzsproutPlayer;