
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = "" }) => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <motion.div 
      className={`relative cursor-pointer ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      onClick={scrollToTop}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <img 
          src="/lovable-uploads/3b997f48-dd7e-4f42-8002-e3613bfa91a1.png" 
          alt="WORLDMOTOCLASH Logo" 
          className="h-10 md:h-12 w-auto"
        />
        <motion.div 
          className="absolute -bottom-1 left-0 h-[2px] bg-black"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default AnimatedLogo;
