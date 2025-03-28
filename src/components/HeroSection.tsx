
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

// Define the video data structure
interface VideoData {
  id: number;
  videoSrc: string;
  videoTitle: string;
  title: string;
  subtitle: string;
}

const HeroSection: React.FC = () => {
  // Array of video data
  const videos: VideoData[] = [
    {
      id: 1,
      videoSrc: "https://www.youtube.com/embed/mVkp_elkgQk?start=55&autoplay=1&mute=1&loop=1&playlist=mVkp_elkgQk&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1",
      videoTitle: "The Corkscrew",
      title: "NOTHING LIKE IT",
      subtitle: "Danger. Danger. Danger"
    },
    {
      id: 2,
      videoSrc: "https://www.youtube.com/embed/VJm7IPrBmLY?autoplay=1&mute=1&loop=1&playlist=VJm7IPrBmLY&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1",
      videoTitle: "MotoGP Racing",
      title: "PURE SPEED",
      subtitle: "Feel the adrenaline"
    },
    {
      id: 3,
      videoSrc: "https://www.youtube.com/embed/iGd9Sm3EJpQ?autoplay=1&mute=1&loop=1&playlist=iGd9Sm3EJpQ&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1",
      videoTitle: "Circuit Racing",
      title: "PRECISION MATTERS",
      subtitle: "Every corner counts"
    },
    {
      id: 4,
      videoSrc: "https://www.youtube.com/embed/6Qm9kf1-C6Q?autoplay=1&mute=1&loop=1&playlist=6Qm9kf1-C6Q&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1",
      videoTitle: "Championship Race",
      title: "ELITE COMPETITION",
      subtitle: "Where legends are made"
    }
  ];

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
              Reimagining the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">Motorsport</span> Industry
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
              <Carousel className="w-full h-full">
                <CarouselContent className="h-full">
                  {videos.map((video) => (
                    <CarouselItem key={video.id} className="h-full">
                      <div className="relative h-full w-full">
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                          <iframe 
                            className="w-[130%] h-[130%]" 
                            src={video.videoSrc}
                            title={video.videoTitle}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            frameBorder="0"
                            loading="lazy"
                          ></iframe>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-6">
                          <h3 className="text-white text-3xl font-bold">{video.title}</h3>
                          <p className="text-white text-lg opacity-80">{video.subtitle}</p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 bg-white/70 hover:bg-white/90 backdrop-blur-sm border-none" />
                <CarouselNext className="right-2 bg-white/70 hover:bg-white/90 backdrop-blur-sm border-none" />
              </Carousel>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
