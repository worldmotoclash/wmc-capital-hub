
import { useState } from 'react';

export const useInvestNowAction = () => {
  const [showTierDialog, setShowTierDialog] = useState(false);

  const handleInvestNowClick = () => {
    const tiersSection = document.getElementById('perks');
    if (tiersSection) {
      const offset = 80; // Account for navbar height
      const elementPosition = tiersSection.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      
      // Show dialog after scrolling
      setTimeout(() => {
        setShowTierDialog(true);
      }, 500);
    }
  };

  return {
    showTierDialog,
    setShowTierDialog,
    handleInvestNowClick,
  };
};
