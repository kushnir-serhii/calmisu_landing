import { kitGroups } from "./kitGroups";

export const KitNavList = () => {
  return (
    <ul className="flex flex-col gap-1">
      {kitGroups.map((group) => (
        <li key={group.id}>
          <a
            href={`#${group.id}`}
            className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {group.title}
          </a>
        </li>
      ))}
    </ul>
  );
};
