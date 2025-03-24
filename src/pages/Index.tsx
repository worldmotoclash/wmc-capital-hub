
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import InvestmentHighlights from '@/components/InvestmentHighlights';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Index: React.FC = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Handle lazy loading of images
    const blurDivs = document.querySelectorAll('.blur-load');
    blurDivs.forEach(div => {
      const img = div.querySelector('img');
      
      function loaded() {
        div.classList.add('loaded');
      }
      
      if (img?.complete) {
        loaded();
      } else {
        img?.addEventListener('load', loaded);
      }
    });
    
    return () => {
      blurDivs.forEach(div => {
        const img = div.querySelector('img');
        img?.removeEventListener('load', () => div.classList.add('loaded'));
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <InvestmentHighlights />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;
