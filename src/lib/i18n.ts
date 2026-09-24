/** Shared helpers for Astro's localized `[lang]` dynamic-route pages. */

/** Build the `getStaticPaths()` return value for a list of language codes. */
export function langStaticPaths(langs: readonly string[]) {
  return langs.map((lang) => ({ params: { lang } }));
}

/**
 * Resolve the requested `lang` param against a content map, falling back to
 * "en" when the param isn't one of the available keys.
 */
export function resolveLang<T extends Record<string, unknown>>(
  lang: string | undefined,
  available: T,
): keyof T {
  return (available[lang as keyof T] ? lang : "en") as keyof T;
}

// Exported rather than declared in each page: Astro hoists `getStaticPaths`
// out of the frontmatter, so it can't see page-local constants.
export const CALMISU_LANGS = ["en", "pl", "uk"] as const;
export const ALMA_LANGS = ["en", "es", "uk"] as const;
