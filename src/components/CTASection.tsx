import { useState, useRef } from "react";
import { Play, Pause } from "lucide-react";
import { NotifyMe } from "./popups/NotifyMe";
import riverMeditationAudio from "@/assets/river_meditation.mp3";
import infinityBg from "@/assets/infinity.webp";

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.7099 19.5C17.8799 20.74 16.9999 21.95 15.6599 21.97C14.3199 22 13.8899 21.18 12.3699 21.18C10.8399 21.18 10.3699 21.95 9.09985 22C7.78985 22.05 6.79985 20.68 5.95985 19.47C4.24985 17 2.93985 12.45 4.69985 9.39C5.56985 7.87 7.12985 6.91 8.81985 6.88C10.0999 6.86 11.3199 7.75 12.1099 7.75C12.8899 7.75 14.3699 6.68 15.9199 6.84C16.5699 6.87 18.3899 7.1 19.5599 8.82C19.4699 8.88 17.3899 10.1 17.4099 12.63C17.4399 15.65 20.0599 16.66 20.0899 16.67C20.0599 16.74 19.6699 18.11 18.7099 19.5ZM12.9999 3.5C13.7299 2.67 14.9399 2.04 15.9399 2C16.0699 3.17 15.5999 4.35 14.8999 5.19C14.2099 6.04 13.0699 6.7 11.9499 6.61C11.7999 5.46 12.3599 4.26 12.9999 3.5Z" />
  </svg>
);

const PlayStoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.9657 10.7041L5.23599 1.70037C5.00625 1.56712 4.74523 1.4973 4.47965 1.49805C4.21406 1.49881 3.95344 1.57011 3.72446 1.70467C3.49834 1.83337 3.31048 2.01984 3.1801 2.245C3.04972 2.47015 2.9815 2.72591 2.98243 2.98609V21.013C2.9815 21.2732 3.04972 21.5289 3.1801 21.7541C3.31048 21.9792 3.49834 22.1657 3.72446 22.2944C3.95344 22.429 4.21406 22.5003 4.47965 22.501C4.74524 22.5018 5.00626 22.432 5.236 22.2987L20.9657 13.295C21.1978 13.1676 21.3915 12.9801 21.5264 12.7522C21.6613 12.5243 21.7324 12.2644 21.7324 11.9995C21.7324 11.7347 21.6613 11.4748 21.5264 11.2469C21.3915 11.019 21.1978 10.8315 20.9657 10.7041ZM13.4999 13.0602L15.2677 14.828L6.99985 19.5602L13.4999 13.0602ZM6.9988 4.43774L15.2678 9.17102L13.4999 10.9389L6.9988 4.43774ZM16.6168 14.0558L14.5605 11.9995L16.6169 9.94322L20.2094 11.9995L16.6168 14.0558Z" />
  </svg>
);

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
              src={infinityBg}
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
          <div className="flex flex-col items-center gap-3 w-full px-6 sm:px-0 max-w-[320px]">
            {/* iOS button */}
            <button
              onClick={() => setIsNotifyOpen(true)}
              className="flex w-full h-[54px] px-6 justify-center items-center gap-2 rounded-xl bg-foreground text-background font-body text-base sm:text-lg font-normal leading-[150%] hover:opacity-90 transition-opacity touch-manipulation"
            >
              Join iOS Waitlist
              <AppleIcon />
            </button>

            {/* Android button */}
            <a
              href="https://play.google.com/store/apps/details?id=com.calmisu.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full h-[54px] px-6 justify-center items-center gap-2 rounded-xl bg-foreground text-background font-body text-base sm:text-lg font-normal leading-[150%] hover:opacity-90 transition-opacity touch-manipulation"
            >
              Download for Android
              <PlayStoreIcon />
            </a>

            {/* QR code card — desktop only */}
            <div className="hidden md:flex items-center gap-4 w-full bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 mt-1">
              <img
                src="/icons/frame.svg"
                alt="QR code"
                className="w-12 h-12 shrink-0"
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
