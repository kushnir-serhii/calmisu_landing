import type { KitGroup } from "./kitGroups";

interface KitSectionProps {
  group: KitGroup;
}

export const KitSection = ({ group }: KitSectionProps) => {
  const { id, title, description, Demo } = group;

  return (
    <section id={id} className="scroll-mt-24 flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="font-display text-2xl sm:text-3xl font-normal text-foreground">
          {title}
        </h2>
        <p className="font-body text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Demo />
      </div>
    </section>
  );
};
