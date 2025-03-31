
import React, { useRef, useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';

// Define the video data structure
export interface VideoData {
  id: number;
  videoSrc: string;
  videoTitle: string;
  title: string;
  subtitle: string;
  duration?: number;
}

interface VideoCarouselProps {
  videos: VideoData[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos }) => {
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Function to extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    let videoId = null;
    
    if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    
    return videoId;
  };

  // Function to ensure YouTube parameters are properly set for autoplay
  const getEnhancedVideoUrl = (url: string) => {
    const videoId = extractVideoId(url);
    
    if (!videoId) return url;
    
    // Always include autoplay parameters
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&origin=${window.location.origin}`;
  };

  // Handle slide change and log for debugging
  const handleSlideChange = (swiper: SwiperType) => {
    console.log('Slide changed to:', swiper.realIndex);
    setActiveIndex(swiper.realIndex);
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ 
          delay: 8000, 
          disableOnInteraction: false,
          pauseOnMouseEnter: false
        }}
        loop={true}
        speed={1000}
        className="h-full w-full rounded-2xl"
        onSwiper={(swiper) => {
          setSwiper(swiper);
          setActiveIndex(swiper.realIndex);
        }}
        onSlideChange={handleSlideChange}
        watchSlidesProgress
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video.id} className="h-full w-full">
            <div className="relative h-full w-full">
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50 z-10"></div>
              
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <AspectRatio ratio={16/9} className="w-full h-full">
                  {isMounted && (
                    <iframe 
                      className="w-full h-full" 
                      src={getEnhancedVideoUrl(video.videoSrc)}
                      title={video.videoTitle}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      frameBorder="0"
                      loading="lazy"
                      allowFullScreen
                    ></iframe>
                  )}
                </AspectRatio>
              </div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                <h3 className="text-white text-3xl font-bold">{video.title}</h3>
                <p className="text-white text-lg opacity-80">{video.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Navigation Arrows */}
      <button
        onClick={() => swiper?.slidePrev()}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 text-white hover:text-gray-200 transition-colors duration-300"
        aria-label="Previous slide"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>

      <button
        onClick={() => swiper?.slideNext()}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 text-white hover:text-gray-200 transition-colors duration-300"
        aria-label="Next slide"
      >
        <ArrowRight className="h-8 w-8" />
      </button>
    </div>
  );
};

export default VideoCarousel;
