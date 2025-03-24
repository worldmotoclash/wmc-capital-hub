
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
  return (
    <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-1/3 h-1/3 bg-gradient-to-br from-gray-100 to-transparent opacity-70 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-gray-100 to-transparent opacity-70 rounded-full blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
      </div>
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <motion.div 
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="inline-block px-3 py-1 mb-6 border border-gray-200 rounded-full bg-white/50 backdrop-blur-sm">
                <span className="text-xs font-medium text-gray-600">
                  Exclusive Investor Portal
                </span>
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Revolutionizing the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">Motorsport</span> Industry
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl leading-relaxed text-balance"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Join the future of competitive motorsport with World Moto Clash. Exclusive investment opportunities for visionary partners.
            </motion.p>
            
            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Button asChild className="bg-black hover:bg-black/80 text-white px-8 py-6 rounded-md text-base">
                <Link to="/login">Investor Login</Link>
              </Button>
              <Button asChild variant="outline" className="border-black text-black hover:bg-black/5 px-8 py-6 rounded-md text-base">
                <a href="#contact">Contact Us</a>
              </Button>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex-1 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <div className="w-full h-[500px] relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 blur-load" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1458668383970-8ddd3927deed?ixlib=rb-1.2.1&auto=format&fit=crop&w=50&q=20)' }}>
                <img 
                  src="https://images.unsplash.com/photo-1458668383970-8ddd3927deed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
                  alt="Motorcycle racer at Laguna Seca" 
                  className="w-full h-full object-cover"
                  onLoad={(e) => e.currentTarget.parentElement?.classList.add('loaded')}
                />
              </div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
