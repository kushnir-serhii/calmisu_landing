import type { ReactNode } from "react";
import { Lightbulb, Wind } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/Section";

interface FeatureItem {
  icon: ReactNode;
  title: string;
  text: string;
}

interface FeatureSplitProps {
  id: string;
  className?: string;
  /** Overrides the section's default vertical padding — FeaturesScience has
   *  no top padding since it immediately follows FeaturesFlow. */
  paddingY?: string;
  heading: string;
  intro: string;
  items: FeatureItem[];
  imageSrc: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  /** Image-left / flex-col-reverse layout (FeaturesScience). */
  reverse?: boolean;
}

/** Shared two-column "heading + intro + icon list" / image layout behind
 *  FeaturesFlow and FeaturesScience — they differ only in copy, data and
 *  whether the image sits left or right. */
const FeatureSplit = ({
  id,
  className,
  paddingY = "py-16 sm:py-20 md:py-[120px]",
  heading,
  intro,
  items,
  imageSrc,
  imageAlt,
  imageWidth,
  imageHeight,
  reverse = false,
}: FeatureSplitProps) => {
  return (
    <Section id={id} className={className} paddingY={paddingY}>
      <div
        className={`flex ${reverse ? "flex-col-reverse" : ""} lg:flex-row items-center gap-8 md:gap-10 w-full`}
      >
        {/* Text */}
        <div className="flex flex-col items-start gap-8 md:gap-12 flex-1">
          <div className="flex flex-col items-start gap-4 md:gap-6 max-w-[577px]">
            <SectionHeading>{heading}</SectionHeading>
            <p className="text-foreground font-body text-base sm:text-lg font-light leading-[150%]">
              {intro}
            </p>
          </div>
          <div className="flex flex-col items-start gap-4 md:gap-6 w-full">
            {items.map((item, i) => (
              <div key={i} className="flex items-start sm:items-center gap-3 sm:gap-4 w-full">
                <div className="flex w-9 h-9 sm:w-10 sm:h-10 justify-center items-center rounded-lg bg-muted shrink-0 mt-0.5 sm:mt-0">
                  {item.icon}
                </div>
                <p className="flex-1 text-foreground font-body text-base sm:text-lg font-light leading-[140%]">
                  <span className="font-medium">{item.title}</span> {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="flex w-full lg:w-1/2 justify-center items-end rounded-3xl overflow-hidden shrink-0">
          <img
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="w-full object-contain"
            loading="lazy"
          />
        </div>
      </div>
    </Section>
  );
};

const flowFeatures: FeatureItem[] = [
  { icon: <span className="text-foreground font-body text-lg sm:text-xl font-normal leading-[140%]">1</span>, title: "Guided breathing", text: "exercises activate your parasympathetic nervous system, signaling safety to your body." },
  { icon: <span className="text-foreground font-body text-lg sm:text-xl font-normal leading-[140%]">2</span>, title: "5-sense grounding", text: "brings you back to the present moment, anchoring you in physical reality." },
  { icon: <span className="text-foreground font-body text-lg sm:text-xl font-normal leading-[140%]">3</span>, title: "Mindful kanji writing", text: "channels focus and movement into meditative intention, quieting mental chatter." },
  { icon: <span className="text-foreground font-body text-lg sm:text-xl font-normal leading-[140%]">4</span>, title: "Calming meditation music", text: "seals the practice, letting your system integrate and restore." },
];

export const FeaturesFlow = () => (
  <FeatureSplit
    id="features"
    className="scroll-mt-20"
    heading="How Calmisu calms anxiety in four steps"
    intro="Each step in the Calming Flow is designed to build on the last, progressively regulating your nervous system."
    items={flowFeatures}
    imageSrc="/images/activities.webp"
    imageAlt="Four calming activities: grounding, breathing, mindful kanji calligraphy, and meditation music"
    imageWidth={885}
    imageHeight={884}
  />
);

const KanjiIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M4 17.5C5.83333 16 9.6 12 10 8.00003H4.5M12 7.5V3M12 7.5C12.0112 7.58237 12.022 7.66659 12.0322 7.75254M12 7.5C12.0084 7.58397 12.0192 7.66816 12.0322 7.75254M12.0322 7.75254C12.3784 10.6581 12.1672 15.5361 12.0558 17.5678C12.027 18.0929 11.5924 18.5 11.0665 18.5H8.5M12.0322 7.75254C12.2152 8.93665 12.847 10.1578 13.6899 11.3264M20 17.5C18.7452 16.4734 15.648 14.0415 13.6899 11.3264M13.6899 11.3264C14.6266 11.051 17 9.7 19 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const scienceFeatures: FeatureItem[] = [
  { icon: <Lightbulb size={24} aria-hidden="true" />, title: "Waves of panic usually pass.", text: "Knowing that can take some of the fear out of the fear itself." },
  { icon: <Wind size={24} aria-hidden="true" />, title: "Slow, steady breathing may stimulate the vagus nerve, ", text: "which can help your body settle." },
  { icon: <KanjiIcon />, title: "Purposeful physical activity — like calligraphy — ", text: "can help interrupt rumination and bring you back to the present." },
];

export const FeaturesScience = () => (
  <FeatureSplit
    id="science"
    paddingY="pb-16 sm:pb-20 md:pb-[120px]"
    heading="Why breathing and grounding can help"
    intro="Calmisu's exercises draw on well-known self-regulation techniques. It's self-help, not treatment."
    items={scienceFeatures}
    imageSrc="/images/phone-breathe.webp"
    imageAlt="Calmisu's guided breathing screen, showing a smiling cloud and step-by-step inhale count"
    imageWidth={885}
    imageHeight={885}
    reverse
  />
);
