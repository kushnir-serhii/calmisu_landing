import { CheckIcon } from "@/components/ui/icons";
import { AppleIcon } from "@/components/ui/AppleIcon";
import { PlayStoreIcon } from "@/components/ui/PlayStoreIcon";
import { KitExample } from "../KitExample";

const ICON_EXAMPLES: { id: string; label: string; Icon: React.ComponentType }[] = [
  { id: "check", label: "Check", Icon: CheckIcon },
  { id: "apple", label: "Apple", Icon: AppleIcon },
  { id: "play-store", label: "Google Play", Icon: PlayStoreIcon },
];

export const IconsDemo = () => {
  return (
    <>
      {ICON_EXAMPLES.map((example) => (
        <KitExample key={example.id} label={example.label}>
          <div className="text-foreground h-6 w-6">
            <example.Icon />
          </div>
        </KitExample>
      ))}
    </>
  );
};
