import { useState } from "react";
import { NotifyMe } from "@/components/popups/NotifyMe";
import { DownloadButtons } from "@/components/ui/DownloadButtons";

// The only interactive part of the hero. Kept as a separate island so the
// rest of the hero ships as static HTML and React stays off the critical path.
const HeroCTA = () => {
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  return (
    <>
      <DownloadButtons
        location="hero"
        onIosClick={() => setIsNotifyOpen(true)}
        className="px-6 sm:px-0"
      />
      <NotifyMe isOpen={isNotifyOpen} onClose={() => setIsNotifyOpen(false)} />
    </>
  );
};

export default HeroCTA;
