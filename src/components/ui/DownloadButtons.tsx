import { track } from "@/lib/analytics";
import { PLAY_URL } from "@/constants/links";
import { Button } from "@/components/ui/button";

interface DownloadButtonsProps {
  /** "row" places buttons side by side from sm+; "col" always stacks them. */
  layout?: "row" | "col";
  /** Which buttons to render. Defaults to both. */
  only?: "ios" | "android";
  /** Analytics location tag, e.g. "hero", "footer_cta", "blog_cta". */
  location: string;
  /** Called when the iOS button is clicked (e.g. to open the waitlist modal). Required unless only="android". */
  onIosClick?: () => void;
  /** Tailwind width classes applied to each button. */
  widthClass?: string;
  /** When false, neither button calls track() (e.g. for the UI gallery). Defaults to true. */
  trackClicks?: boolean;
  className?: string;
}

const DownloadButtons = ({
  layout = "row",
  only,
  location,
  onIosClick,
  widthClass = "w-full sm:w-[260px]",
  trackClicks = true,
  className = "",
}: DownloadButtonsProps) => {
  const containerClass =
    layout === "row"
      ? "flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto"
      : "flex flex-col items-center gap-3 w-full";

  return (
    <div className={`${containerClass} ${className}`}>
      {only !== "android" && (
        <Button
          variant="store"
          store="ios"
          className={widthClass}
          onClick={() => {
            if (trackClicks) track("cta_click", { platform: "ios", location });
            onIosClick?.();
          }}
        >
          Join iOS Waitlist
        </Button>
      )}
      {only !== "ios" && (
        <Button asChild variant="store" store="android" className={widthClass}>
          <a
            href={PLAY_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              if (trackClicks) track("cta_click", { platform: "android", location });
            }}
          >
            Download for Android
          </a>
        </Button>
      )}
    </div>
  );
};

export { DownloadButtons };
