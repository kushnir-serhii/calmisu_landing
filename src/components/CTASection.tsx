import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { NotifyMe } from "./popups/NotifyMe";
import riverMeditationAudio from "@/assets/river_meditation.mp3";
import infinityBg from "@/assets/infinity.webp";
import { QRCodeGen } from "./ui/QRCodeGen";
import { DownloadButtons } from "./ui/DownloadButtons";
import { track } from "@/lib/analytics";

const CTASection = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        track("meditation_preview_play", { track_name: "river_flow" });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section
      id="download"
      className="w-full px-6 sm:px-8 md:px-16 lg:px-[140px] py-16 sm:py-20 md:py-[120px]"
    >
      <div className="flex flex-col lg:flex-row items-center w-full min-h-[auto] lg:min-h-[589px] rounded-2xl sm:rounded-[30px] bg-brand-100 overflow-hidden">
        {/* Left: Music player card */}
        <div className="flex w-full lg:w-1/2 h-[350px] sm:h-[450px] lg:h-[589px] rounded-2xl sm:rounded-[30px] overflow-hidden relative justify-center items-center p-6 sm:p-8">
          <div className="relative w-full max-w-[320px] sm:max-w-[400px] aspect-square rounded-2xl overflow-hidden shadow-lg">
            <img
              src={infinityBg.src}
              alt="Bamboo Forest background"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-6 sm:p-8 text-center">
              <h3 className="text-white text-xl sm:text-2xl font-display font-normal mb-2 drop-shadow-lg">
                River Flow
              </h3>
              <button
                onClick={togglePlay}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 hover:bg-white/20 backdrop-blur-[10px] rounded-full flex items-center justify-center transition-all duration-300 mb-4 sm:mb-6 touch-manipulation outline-none"
              >
                {isPlaying ? (
                  <Pause
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                    fill="white"
                  />
                ) : (
                  <Play
                    className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-0.5 sm:ml-1"
                    fill="white"
                  />
                )}
              </button>
              <p className="text-white text-xs sm:text-sm font-light leading-relaxed max-w-[280px] drop-shadow-lg">
                You can sit or lie down, keep your eyes open or closed. However
                you are is enough.
              </p>
            </div>
          </div>
          <audio
            ref={audioRef}
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          >
            <source src={riverMeditationAudio} type="audio/mpeg" />
          </audio>
        </div>

        {/* Right: CTA content */}
        <div className="flex flex-col items-center justify-center gap-8 sm:gap-10 w-full lg:w-1/2  py-12 sm:py-16 lg:py-20 px-5 sm:px-6">
          <h2 className="whitespace-pre text-foreground text-center font-display text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-normal leading-[100%]">
            {`Real calm.\n Join freely.`}
          </h2>
          <div className="flex flex-col items-center gap-3 w-full px-0 sm:px-6 max-w-[320px]">
            <DownloadButtons
              layout="col"
              widthClass="w-full"
              location="footer_cta"
              onIosClick={() => setIsNotifyOpen(true)}
            />
            <p className="text-muted-foreground text-center font-body text-sm font-light leading-[140%]">
              Free · No ads · No account needed
            </p>
            {/* QR code card — desktop only */}
            <div className="hidden md:flex items-center gap-4 w-full bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 mt-1">
              <QRCodeGen
                data="https://play.google.com/store/apps/details?id=com.calmisu.app"
                size={44}
              />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Get the Android app
                </p>
                <p className="text-xs text-slate-500">
                  Scan with your phone's camera
                </p>
              </div>
            </div>
          </div>

          <NotifyMe
            isOpen={isNotifyOpen}
            onClose={() => setIsNotifyOpen(false)}
          />
        </div>
      </div>
    </section>
  );
};

export default CTASection;
