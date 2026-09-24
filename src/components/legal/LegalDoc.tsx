import type { ReactNode } from "react";
import { EMAIL_SUPPORT, GMAIL_COMPOSE_URL } from "@/constants/mail";

/** Shared primitives for the legal document pages (Calmisu + Alma privacy/terms). */

export function LegalDoc({
  children,
  className = "max-w-xl mx-auto px-6 py-4 sm:px-12",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

export function LegalTitle({ children }: { children: ReactNode }) {
  return <strong className="block font-bold">{children}</strong>;
}

export function LegalHeading({ children }: { children: ReactNode }) {
  return <strong className="block font-bold mt-4">{children}</strong>;
}

export function LegalText({
  children,
  className = "mt-1 leading-snug text-sm",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <p className={className}>{children}</p>;
}

export function LegalList({
  children,
  className = "list-disc pl-6 mt-1 text-sm space-y-1",
  ordered = false,
}: {
  children: ReactNode;
  className?: string;
  ordered?: boolean;
}) {
  return ordered ? <ol className={className}>{children}</ol> : <ul className={className}>{children}</ul>;
}

export function ExternalLink({
  href,
  children,
  className = "text-blue-600 underline",
  blank = true,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  blank?: boolean;
}) {
  return blank ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

export function SupportEmailLink({ className = "text-blue-600 underline" }: { className?: string }) {
  return (
    <ExternalLink href={`${GMAIL_COMPOSE_URL}${EMAIL_SUPPORT}`} className={className}>
      {EMAIL_SUPPORT}
    </ExternalLink>
  );
}

export function LegalCallout({
  children,
  className = "mt-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
