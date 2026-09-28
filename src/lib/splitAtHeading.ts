/**
 * Splits a rendered HTML string right before the Nth `<h2` tag, so a caller
 * can slot something (the blog's mid-article quiz teaser) between two
 * sections of an article without touching the markdown source or the
 * heading ids Astro's markdown renderer assigns.
 *
 * Deliberately a plain string operation rather than an HTML parse: the
 * input is Astro's own rendered output, so the tags are well-formed, and a
 * regex on `<h2` (guarded so it can't match `<h2foo`) is enough to find
 * heading boundaries without pulling in a DOM parser for one call site.
 */

export interface HeadingSplit {
  before: string;
  after: string;
}

/**
 * @param html Rendered article HTML.
 * @param occurrence 1-based index of the `<h2` to split before (default 3,
 *   i.e. "after two full sections"). If the article has fewer headings than
 *   this, splits before the last one instead. If it has none, `after` is
 *   empty and `before` is the whole string.
 */
export function splitAtHeading(html: string, occurrence = 3): HeadingSplit {
  const headingPattern = /<h2(?=[\s>])/g;
  const positions: number[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingPattern.exec(html)) !== null) {
    positions.push(match.index);
  }

  if (positions.length === 0) {
    return { before: html, after: "" };
  }

  const targetIndex = Math.min(occurrence, positions.length) - 1;
  const splitPos = positions[targetIndex];

  return {
    before: html.slice(0, splitPos),
    after: html.slice(splitPos),
  };
}
