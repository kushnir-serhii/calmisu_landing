import { EsFlagIcon } from "@/components/ui/flags/EsFlagIcon";
import { PlFlagIcon } from "@/components/ui/flags/PlFlagIcon";
import { UaFlagIcon } from "@/components/ui/flags/UaFlagIcon";
import { UkFlagIcon } from "@/components/ui/flags/UkFlagIcon";
import { KitExample } from "../KitExample";

type FlagLanguage = {
  id: string;
  label: string;
  Icon: React.ComponentType<{ size?: number }>;
};

const FLAG_EXAMPLES: FlagLanguage[] = [
  { id: "es", label: "Spanish", Icon: EsFlagIcon },
  { id: "pl", label: "Polish", Icon: PlFlagIcon },
  { id: "ua", label: "Ukrainian", Icon: UaFlagIcon },
  { id: "uk", label: "English (UK)", Icon: UkFlagIcon },
];

const FLAG_SIZES = [16, 32, 48];

export const FlagsDemo = () => {
  return (
    <>
      {FLAG_EXAMPLES.map((language) =>
        FLAG_SIZES.map((size) => (
          <KitExample
            key={`${language.id}-${size}`}
            label={`${language.label} · ${size}px`}
          >
            <language.Icon size={size} />
          </KitExample>
        )),
      )}
    </>
  );
};
