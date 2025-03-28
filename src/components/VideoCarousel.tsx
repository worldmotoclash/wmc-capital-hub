
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';

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
  );
};

export default VideoCarousel;
