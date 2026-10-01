import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync, readdirSync } from "fs";
import path from "path";

/**
 * Build-output acceptance checks for the UI component gallery (spec 003,
 * functional-spec.md §2.1): the page ships at /ui-kit/ but is noindexed,
 * absent from the sitemap, and linked from nowhere on the live site. These
 * read the static `dist/` output. Run `npm run build` first; the whole file
 * is skipped (not failed) when `dist/` is absent.
 *
 * @spec: 003-ui-component-gallery
 */

const ROOT = path.resolve(__dirname, "../..");
const DIST = path.join(ROOT, "dist");
const distExists = existsSync(DIST);

function read(relPath: string): string {
  return readFileSync(path.join(DIST, relPath), "utf-8");
}

function htmlFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...htmlFiles(full));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

describe.skipIf(!distExists)("ui-kit build output", () => {
  if (!distExists) {
    console.warn(
      "[uiKit.build.acceptance] dist/ not found — run `npm run build` first. Skipping build-output acceptance checks."
    );
  }

  const KIT_PAGE = path.join("ui-kit", "index.html");
  let kitHtml = "";
  beforeAll(() => {
    kitHtml = existsSync(path.join(DIST, KIT_PAGE)) ? read(KIT_PAGE) : "";
  });

  // @spec: 003-ui-component-gallery @regression
  it("/ui-kit/ is built and tells search engines not to index it", () => {
    expect(existsSync(path.join(DIST, KIT_PAGE))).toBe(true);
    expect(kitHtml).toContain('content="noindex, nofollow"');
  });

  // @spec: 003-ui-component-gallery @regression
  it("the sitemap does not list /ui-kit/", () => {
    for (const file of ["sitemap-0.xml", "sitemap-index.xml"]) {
      expect(existsSync(path.join(DIST, file))).toBe(true);
      expect(read(file)).not.toContain("ui-kit");
    }
  });

  // @spec: 003-ui-component-gallery @regression
  it("no other page links to /ui-kit/", () => {
    const offenders: string[] = [];
    for (const file of htmlFiles(DIST)) {
      if (path.relative(DIST, file) === KIT_PAGE) continue;
      const html = readFileSync(file, "utf-8");
      if (
        html.includes('href="/ui-kit/"') ||
        html.includes('href="/ui-kit"') ||
        html.includes("https://calmisu.com/ui-kit")
      ) {
        offenders.push(path.relative(DIST, file));
      }
    }
    expect(offenders).toEqual([]);
  });

  // @spec: 003-ui-component-gallery @regression
  it("robots.txt does not disallow /ui-kit", () => {
    expect(read("robots.txt")).not.toMatch(/disallow:\s*\/ui-kit/i);
  });
});
