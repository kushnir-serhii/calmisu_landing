import { useEffect, useRef, useState } from "react";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { Button } from "@/components/ui/button";
import { KitExample } from "../KitExample";

/**
 * The fixed-height `overflow-y-auto` box is the nearest scroll container of the
 * `.reveal` element, so it becomes the `view()` timeline: the example animates
 * as it enters the box, independently of the page scroll.
 */
export const AnimatedSectionDemo = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const exampleRef = useRef<HTMLDivElement>(null);
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(CSS.supports("animation-timeline: view()"));
  }, []);

  const replay = () => {
    const box = boxRef.current;
    const example = exampleRef.current;
    if (!box || !example) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTop = 0;
    requestAnimationFrame(() => {
      // The box is `relative`, so it is the example wrapper's offsetParent.
      const top = Math.max(0, example.offsetTop - (box.clientHeight - example.offsetHeight) / 2);
      box.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
    });
  };

  return (
    <div className="col-span-full">
      <KitExample label="Scroll-reveal">
        <div className="w-full flex flex-col gap-3">
          <div ref={boxRef} className="h-64 overflow-y-auto relative rounded-md border border-input">
            <div className="h-[400px] flex items-start justify-center pt-6 text-sm text-muted-foreground">
              Scroll down ↓
            </div>
            <div ref={exampleRef} className="px-4">
              <AnimatedSection>
                <div className="bg-brand-100 p-6 rounded-xl">Revealed content</div>
              </AnimatedSection>
            </div>
            <div className="h-48" />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button size="pill" onClick={replay}>
              Replay
            </Button>
            {supported === false && (
              <p className="text-sm text-muted-foreground">
                This browser has no scroll-driven animations, so the example is shown without the reveal.
              </p>
            )}
          </div>
        </div>
      </KitExample>
    </div>
  );
};
