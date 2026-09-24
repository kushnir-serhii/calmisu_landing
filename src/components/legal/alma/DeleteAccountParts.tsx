import type { ReactNode } from "react";

/** Shared primitives for the Alma "Delete Account" card layout. */

export function DeleteCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-md bg-background rounded-2xl shadow-sm border border-border p-8 flex flex-col gap-6">
        {children}
      </div>
    </div>
  );
}

export function DeleteHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="font-display text-2xl text-foreground">{title}</h1>
      <p className="text-muted-foreground font-body text-sm">{subtitle}</p>
    </div>
  );
}

export function DeleteSection({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 text-sm font-body">
      {title && <p className="font-medium text-foreground mb-1">{title}</p>}
      {children}
    </div>
  );
}

export function Divider() {
  return <hr className="border-border" />;
}

export function DeleteNote({
  variant = "info",
  children,
}: {
  variant?: "info" | "danger";
  children: ReactNode;
}) {
  const className =
    variant === "danger"
      ? "text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2"
      : "text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2";
  return <p className={className}>{children}</p>;
}
