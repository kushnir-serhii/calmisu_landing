import { EsFlagIcon } from "@/components/ui/flags/EsFlagIcon";
import { PlFlagIcon } from "@/components/ui/flags/PlFlagIcon";
import { UaFlagIcon } from "@/components/ui/flags/UaFlagIcon";
import { UkFlagIcon } from "@/components/ui/flags/UkFlagIcon";
import { KitExample } from "../KitExample";

type FlagConfig = {
  label: string;
  Icon: React.FC<{ size?: number; className?: string }>;
};

const FLAG_EXAMPLES: FlagConfig[] = [
  { label: "English", Icon: UkFlagIcon },
  { label: "Spanish", Icon: EsFlagIcon },
  { label: "Polish", Icon: PlFlagIcon },
  { label: "Ukrainian", Icon: UaFlagIcon },
];

const FLAG_SIZES = [16, 32, 48];

export const FlagsDemo = () => {
  return (
    <>
      {FLAG_EXAMPLES.flatMap((flag) =>
        FLAG_SIZES.map((size) => (
          <KitExample key={`${flag.label}-${size}`} label={`${flag.label} · ${size}px`}>
            <flag.Icon size={size} />
          </KitExample>
        )),
      )}
    </>
  );
};
