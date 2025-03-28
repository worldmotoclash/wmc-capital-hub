
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
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
  return (
    <div className="w-full h-full relative rounded-2xl overflow-hidden">
      <Swiper
        modules={[Autoplay, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        loop
        className="h-full rounded-2xl"
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id} className="h-full">
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
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default VideoCarousel;
