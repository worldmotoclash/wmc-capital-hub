import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';
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
}

interface VideoCarouselProps {
  videos: VideoData[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos }) => {
  const swiperRef = useRef<SwiperType>();
  const [activeIndex, setActiveIndex] = useState(0);

  // Function to ensure YouTube parameters are properly set
  const getEnhancedVideoUrl = (url: string) => {
    // Make sure we're using the embed URL
    if (!url.includes('embed')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        url = `https://www.youtube.com/embed/${videoId}`;
      }
    }
    
    // Ensure necessary YouTube parameters are included
    if (!url.includes('autoplay=1')) {
      url += (url.includes('?') ? '&' : '?') + 'autoplay=1';
    }
    if (!url.includes('mute=1')) {
      url += '&mute=1';
    }
    if (!url.includes('enablejsapi=1')) {
      url += '&enablejsapi=1';
    }
    
    return url;
  };

  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 8000, disableOnInteraction: false }}
        navigation
        loop
        className="h-full rounded-2xl"
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setActiveIndex(swiper.realIndex);
        }}
        onSlideChange={(swiper) => {
          setActiveIndex(swiper.realIndex);
        }}
        watchSlidesProgress
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video.id} className="h-full">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                {/* Only load the active slide and adjacent slides */}
                {(index === activeIndex) || 
                 (index === activeIndex - 1) || 
                 (index === activeIndex + 1) || 
                 (index === 0 && activeIndex === videos.length - 1) || 
                 (index === videos.length - 1 && activeIndex === 0) ? (
                  <iframe 
                    className="w-[130%] h-[130%]" 
                    src={getEnhancedVideoUrl(video.videoSrc)}
                    title={video.videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    frameBorder="0"
                    loading="lazy"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="w-full h-full bg-gray-900"></div>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-3xl font-bold">{video.title}</h3>
                <p className="text-white text-lg opacity-80">{video.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideoCarousel;
