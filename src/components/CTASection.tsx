import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { DownloadButtons } from "./HeroSection";
import riverMeditationAudio from "@/assets/river_meditation.mp3";

const CTASection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section id="download" className="w-full px-6 md:px-[140px] py-[120px]">
      <div className="flex flex-col lg:flex-row items-center w-full min-h-[589px] rounded-[30px] bg-brand-100 overflow-hidden">
        {/* Left: Music player card - 50% */}
        <div className="flex w-full lg:w-1/2 h-[589px] rounded-[30px] overflow-hidden relative justify-center items-center p-8">
          <div className="relative w-full max-w-[400px] aspect-square bg-gradient-to-br from-blue-200 via-teal-100 to-green-100 rounded-2xl overflow-hidden shadow-lg">
            {/* Background image/pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-300/30 via-teal-200/30 to-green-200/30"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center">
              <h3 className="text-foreground text-2xl font-display font-normal mb-2">
                Bamboo Forest
              </h3>
              
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="w-20 h-20 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl mb-6"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-gray-700" />
                ) : (
                  <Play className="w-8 h-8 text-gray-700 ml-1" />
                )}
              </button>
              
              <p className="text-gray-700 text-sm leading-relaxed max-w-[280px]">
                You can sit or lie down, keep your eyes open or closed.
                However you are is enough.
              </p>
            </div>
          </div>
          
          {/* Hidden audio element */}
          <audio
            ref={audioRef}
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={riverMeditationAudio} type="audio/mpeg" />
          </audio>
        </div>

        {/* Right: CTA content - 50% */}
        <div className="flex flex-col items-center justify-center gap-10 w-full lg:w-1/2 py-20 px-6">
          <h2 className="text-foreground text-center font-display text-4xl md:text-5xl lg:text-[60px] font-normal leading-[100%]">
            Real calm. Join freely.
          </h2>
          <DownloadButtons className="!flex-col" />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
