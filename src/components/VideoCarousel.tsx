
import React, { useRef, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Navigation } from 'swiper/modules';
import { AspectRatio } from '@/components/ui/aspect-ratio';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';

// Add type declarations for YouTube API
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

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
  const [apiReady, setApiReady] = useState(false);

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

  // Function to ensure YouTube parameters are properly set
  const getEnhancedVideoUrl = (url: string) => {
    const videoId = extractVideoId(url);
    
    if (!videoId) return url;
    
    // Build a clean embed URL with the necessary parameters
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&showinfo=0&rel=0&loop=1&playlist=${videoId}&origin=${window.location.origin}`;
  };

  // Function to play the active video and pause others
  const controlVideoPlayback = (newIndex: number) => {
    console.log('Attempting to control video playback for index:', newIndex);
    
    if (!apiReady) {
      console.log('YouTube API not ready yet');
      return;
    }
    
    Object.entries(iframeRefs.current).forEach(([idx, iframe]) => {
      if (!iframe || !iframe.contentWindow) {
        console.log('Invalid iframe for index:', idx);
        return;
      }
      
      const index = parseInt(idx);
      
      try {
        if (index === newIndex) {
          console.log('Playing video at index:', index);
          iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
        } else {
          console.log('Pausing video at index:', index);
          iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
        }
      } catch (error) {
        console.error('Error controlling YouTube playback:', error);
      }
    });
  };

  // Load YouTube API
  useEffect(() => {
    const loadYouTubeAPI = () => {
      // Create YouTube API script if it doesn't exist
      if (!document.getElementById('youtube-api')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        
        console.log('YouTube API script added to DOM');
      }
    };
    
    // Handle API ready event
    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API is ready');
      setApiReady(true);
    };
    
    loadYouTubeAPI();
    
    return () => {
      // Clean up
      window.onYouTubeIframeAPIReady = undefined;
    };
  }, []);

  // Play the active video when the slide changes or API becomes ready
  useEffect(() => {
    if (apiReady) {
      // Give a short delay to ensure iframes are properly initialized
      const timer = setTimeout(() => {
        controlVideoPlayback(activeIndex);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [activeIndex, apiReady]);

  // Handle message events from YouTube iframes
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        // Log YouTube events for debugging
        if (data.event === 'onReady' || data.event === 'onStateChange') {
          console.log('YouTube event:', data.event, data.info);
        }
      } catch (e) {
        // Not a JSON message or not from YouTube
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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
                  ref={(el) => { iframeRefs.current[index] = el; }}
                  className="w-[130%] h-[130%]" 
                  src={getEnhancedVideoUrl(video.videoSrc)}
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
