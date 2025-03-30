
import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';

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

  // Function to extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    // Extract video ID from various YouTube URL formats
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
    
    // Build a clean embed URL with the necessary parameters
    // Using autoplay=1&mute=1 to enable autoplay (must be muted for autoplay to work in modern browsers)
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&origin=${window.location.origin}`;
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
          console.log('Slide changed to:', swiper.realIndex);
          setActiveIndex(swiper.realIndex);
        }}
        watchSlidesProgress
      >
        {videos.map((video, index) => (
          <SwiperSlide key={video.id} className="h-full">
            <div className="relative h-full w-full">
              <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                <iframe 
                  className="w-[130%] h-[130%]" 
                  src={index === activeIndex ? getEnhancedVideoUrl(video.videoSrc) : video.videoSrc}
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideoCarousel;
