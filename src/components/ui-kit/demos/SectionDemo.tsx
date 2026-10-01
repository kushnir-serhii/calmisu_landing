import { Section, SectionHeading } from "@/components/ui/Section";
import { KitExample } from "../KitExample";

const HEADING_EXAMPLES = [
  { label: "Heading · Section", size: "section" },
  { label: "Heading · Block", size: "block" },
] as const;

const SECTION_EXAMPLES: { label: string; paddingY?: string }[] = [
  { label: "Section · Default padding" },
  { label: "Section · py-6", paddingY: "py-6" },
];

export const SectionDemo = () => {
  return (
    <>
      {HEADING_EXAMPLES.map(({ label, size }) => (
        <KitExample key={label} label={label}>
          <SectionHeading size={size}>Section heading</SectionHeading>
        </KitExample>
      ))}
      {SECTION_EXAMPLES.map(({ label, paddingY }) => (
        <div key={label} className="col-span-full">
          <KitExample label={label}>
            <div className="w-full">
              <Section
                paddingY={paddingY}
                className="bg-brand-100 outline outline-1 outline-dashed outline-brand-200"
              >
                <p>Section content</p>
              </Section>
            </div>
          </KitExample>
        </div>
      ))}
    </>
  );
};
