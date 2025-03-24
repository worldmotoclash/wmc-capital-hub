
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedLogo from './AnimatedLogo';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <motion.header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all-cubic ${
        scrolled 
          ? 'py-4 bg-white/80 backdrop-blur-md shadow-sm' 
          : 'py-6 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="z-10">
          <AnimatedLogo />
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Link to="/#about" className="text-sm font-medium hover:text-gray-600 transition-colors">
              About
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link to="/#investment" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Investment
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Link to="/#contact" className="text-sm font-medium hover:text-gray-600 transition-colors">
              Contact
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <Button asChild className="bg-black hover:bg-black/80 text-white rounded-md">
              <Link to="/login">Investor Login</Link>
            </Button>
          </motion.div>
        </nav>
        
        <div className="md:hidden">
          <Button asChild variant="outline" className="border-black text-black hover:bg-black/5">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
