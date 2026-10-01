import { kitGroups } from "./kitGroups";
import { KitSidebar } from "./KitSidebar";
import { KitSection } from "./KitSection";

export const UiKitIsland = () => {
  return (
    <div className="mx-auto w-full max-w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-12 text-4xl font-bold text-foreground">UI Kit</h1>
        <div className="flex flex-col gap-6 md:grid md:grid-cols-[200px_minmax(0,1fr)] md:gap-10">
          <div className="md:sticky md:top-[calc(var(--header-h,61px)+1rem)]">
            <KitSidebar />
          </div>
          <div className="flex flex-col gap-16 min-w-0">
            {kitGroups.map((group) => (
              <KitSection key={group.id} group={group} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UiKitIsland;
