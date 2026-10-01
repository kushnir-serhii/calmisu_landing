import { KitNavList } from "./KitNavList";

// Sticky offset = site header height (--header-h, 61px fallback) + 1rem gap.
export const KitSidebar = () => {
  return (
    <nav aria-label="Components">
      <details className="rounded-lg border border-secondary bg-background md:hidden">
        <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-foreground">
          Components
        </summary>
        <div className="px-1 pb-2">
          <KitNavList />
        </div>
      </details>
      <div className="hidden md:sticky md:top-[calc(var(--header-h,61px)+1rem)] md:block">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wide text-foreground">
          Components
        </p>
        <KitNavList />
      </div>
    </nav>
  );
};
