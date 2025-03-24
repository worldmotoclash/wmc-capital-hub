
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  className?: string;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ className = "" }) => {
  return (
    <motion.div 
      className={`relative font-bold text-xl md:text-2xl ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.span 
        className="bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-700"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        WORLDMOTOCLASH
      </motion.span>
      <motion.div 
        className="absolute -bottom-1 left-0 h-[2px] bg-black"
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ delay: 0.4, duration: 0.6, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default AnimatedLogo;
