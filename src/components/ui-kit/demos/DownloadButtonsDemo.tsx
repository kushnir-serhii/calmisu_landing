import type React from "react";

import { DownloadButtons } from "@/components/ui/DownloadButtons";
import { KitExample } from "../KitExample";

type DownloadButtonsProps = React.ComponentProps<typeof DownloadButtons>;

const DOWNLOAD_EXAMPLES: {
  id: string;
  label: string;
  layout?: DownloadButtonsProps["layout"];
  only?: DownloadButtonsProps["only"];
}[] = [
  { id: "row", label: "Row", layout: "row" },
  { id: "col", label: "Column", layout: "col" },
  { id: "ios-only", label: "iOS only", only: "ios" },
  { id: "android-only", label: "Android only", only: "android" },
];

const noopIosClick = () => {};

export const DownloadButtonsDemo = () => {
  return (
    <>
      {DOWNLOAD_EXAMPLES.map((example) => (
        <KitExample key={example.id} label={example.label}>
          <DownloadButtons
            layout={example.layout}
            only={example.only}
            location="ui_kit"
            trackClicks={false}
            onIosClick={noopIosClick}
            widthClass="w-full max-w-[260px]"
          />
        </KitExample>
      ))}
    </>
  );
};
