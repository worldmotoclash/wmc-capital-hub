
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
  const iframeRefs = useRef<Record<number, HTMLIFrameElement | null>>({});

  // Function to ensure YouTube parameters are properly set
  const getEnhancedVideoUrl = (url: string) => {
    // Extract video ID from various YouTube URL formats
    let videoId;
    
    if (url.includes('embed')) {
      videoId = url.split('/embed/')[1]?.split('?')[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    }
    
    if (!videoId) return url;
    
    // Build a clean embed URL with the necessary parameters
    return `https://www.youtube.com/embed/${videoId}?autoplay=0&mute=1&enablejsapi=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}`;
  };

  // Function to play the active video and pause others
  const controlVideoPlayback = (newIndex: number) => {
    Object.entries(iframeRefs.current).forEach(([idx, iframe]) => {
      if (!iframe || !iframe.contentWindow) return;
      
      const index = parseInt(idx);
      
      if (index === newIndex) {
        // Play the active video
        iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        // Update the src to include autoplay=1
        if (!iframe.src.includes('autoplay=1')) {
          iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1');
        }
      } else {
        // Pause other videos
        iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      }
    });
  };

  // Initialize YouTube API
  useEffect(() => {
    // Create YouTube API script if it doesn't exist
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
    
    // Handle API ready event
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API ready');
      
      // Play the initial video after a short delay to ensure API is fully loaded
      setTimeout(() => {
        controlVideoPlayback(activeIndex);
      }, 1000);
    };
    
    return () => {
      // Clean up
      window.onYouTubeIframeAPIReady = null;
    };
  }, []);

  // Play the active video when the slide changes
  useEffect(() => {
    controlVideoPlayback(activeIndex);
  }, [activeIndex]);

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
                <iframe 
                  ref={(el) => { iframeRefs.current[index] = el; }}
                  className="w-[130%] h-[130%]" 
                  src={getEnhancedVideoUrl(video.videoSrc)}
                  title={video.videoTitle}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  frameBorder="0"
                  loading="lazy"
                  allowFullScreen
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
