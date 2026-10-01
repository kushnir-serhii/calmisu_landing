import type React from "react";

interface KitExampleProps {
  label: string;
  children: React.ReactNode;
}

export const KitExample = ({ label, children }: KitExampleProps) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="min-w-0 flex flex-wrap gap-2">{children}</div>
    </div>
  );
};
