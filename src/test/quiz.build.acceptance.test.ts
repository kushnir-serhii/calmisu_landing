import { describe, it, expect, beforeAll } from "vitest";
import { existsSync, readFileSync, readdirSync } from "fs";
import { execSync } from "child_process";
import path from "path";

/**
 * Build-output acceptance checks for the Calm Profile quiz (spec 002,
 * Slice 9). These read the static `dist/` output rather than jsdom, because
 * several functional-spec.md §2 criteria are about what actually ships in
 * the HTML/sitemap/robots.txt — no amount of component-level testing proves
 * those. Run `npm run build` first; the whole file is skipped (not failed)
 * when `dist/` is absent, so it never blocks a plain `npm run test`.
 *
 * @spec: 002-calm-profile-quiz
 */

const ROOT = path.resolve(__dirname, "../..");
const DIST = path.join(ROOT, "dist");
const distExists = existsSync(DIST);

function read(relPath: string): string {
  return readFileSync(path.join(DIST, relPath), "utf-8");
}

describe.skipIf(!distExists)("quiz build output", () => {
  if (!distExists) {
    console.warn(
      "[quiz.build.acceptance] dist/ not found — run `npm run build` first. Skipping build-output acceptance checks."
    );
  }

  let sitemapXml = "";
  beforeAll(() => {
    const sitemapPath = path.join(DIST, "sitemap-0.xml");
    sitemapXml = existsSync(sitemapPath) ? read("sitemap-0.xml") : "";
  });

  // @spec: 002-calm-profile-quiz @regression
  it("/quiz/ is indexable, in the sitemap, and its H1/intro/trust line/start button are in the static HTML", () => {
    const html = read("quiz/index.html");
    const flat = html.replace(/\s+/g, " ");
    expect(html).not.toMatch(/noindex/);
    expect(sitemapXml).toContain("<loc>https://calmisu.com/quiz/</loc>");
    expect(html).toContain("What pattern does");
    expect(flat).toContain(
      "Answer a few questions and we'll name the pattern yours follows"
    );
    // CONTENT.md's source-of-truth trust-line string ("Free · No account
    // needed") — functional-spec.md §2.1 paraphrases this differently
    // ("Free · 2 minutes · No account needed"), which does not match either
    // CONTENT.md or the shipped copy. Asserting against CONTENT.md/shipped
    // text per the spec's own "don't invent copy" rule; see report.
    expect(html).toContain("Free · No account needed");
    expect(html).toContain("Start the quiz");
  });

  // @spec: 002-calm-profile-quiz @regression
  it("/quiz/ has the exact spec title", () => {
    const html = read("quiz/index.html");
    expect(html).toContain(
      "<title>What&#39;s Your Anxiety Pattern? — 2-Minute Quiz | Calmisu</title>"
    );
  });

  // @spec: 002-calm-profile-quiz @regression
  it("/quiz/result/ carries noindex,follow and is absent from the sitemap", () => {
    const html = read("quiz/result/index.html");
    expect(html).toMatch(/noindex,\s*follow/);
    expect(sitemapXml).not.toContain("/quiz/result");
  });

  // @spec: 002-calm-profile-quiz @regression
  it("robots.txt is unchanged from what's committed", () => {
    const committed = execSync("git show HEAD:public/robots.txt", {
      cwd: ROOT,
      encoding: "utf-8",
    });
    const shipped = read("robots.txt");
    // Compare content only — git and the on-disk build can differ in line
    // endings on Windows checkouts without the file itself having changed.
    expect(shipped.replace(/\r\n/g, "\n")).toBe(
      committed.replace(/\r\n/g, "\n")
    );
  });

  // @spec: 002-calm-profile-quiz @regression
  it("the homepage links /quiz/ with a trailing slash", () => {
    const html = read("index.html");
    expect(html).toMatch(/href="\/quiz\/(\?[^"]*)?"/);
  });

  // @spec: 002-calm-profile-quiz @regression
  it("every blog post has a quiz CTA linking /quiz/?src=blog_<slug>, with at least 4 distinct variants, and no added hydration script", () => {
    const blogDir = path.join(DIST, "blog");
    const slugs = readdirSync(blogDir).filter((entry) =>
      existsSync(path.join(blogDir, entry, "index.html"))
    );
    expect(slugs.length).toBeGreaterThan(0);

    const seenLines = new Set<string>();
    for (const slug of slugs) {
      const html = read(`blog/${slug}/index.html`);
      expect(html).toContain(`/quiz/?src=blog_${slug}`);
      // Each variant has distinct body copy (QuizCTA.astro's COPY map) —
      // count distinct lines around the CTA as a proxy for distinct variants
      // without depending on internal class names.
      const match = html.match(
        /Two minutes, nine questions[\s\S]{0,400}?<\/p>/
      );
      if (match) seenLines.add(match[0]);
    }
    expect(seenLines.size).toBeGreaterThanOrEqual(4);

    // QuizCTA.astro is static markup (no client:* directive), so it must add
    // nothing to any blog page's script surface. Rather than hardcode the
    // count that pre-existing islands/layout scripts happen to produce
    // today, assert every post has the *same* script-tag count as the rest —
    // a per-page-varying count would mean something (like a CTA island) is
    // rendering differently per post — and that no script references the
    // CTA component by name.
    const scriptCounts = slugs.map((slug) => {
      const html = read(`blog/${slug}/index.html`);
      return (html.match(/<script[^>]*>/g) ?? []).length;
    });
    expect(new Set(scriptCounts).size).toBe(1);

    const sample = read(`blog/${slugs[0]}/index.html`);
    expect(sample).toContain('type="application/ld+json"');
    expect(sample).not.toMatch(/QuizCTA/i);
  });

  // @spec: 002-calm-profile-quiz @regression
  it("the nav links /quiz/ with a trailing slash", () => {
    const navLinksSrc = readFileSync(
      path.join(ROOT, "src/data/navLinks.ts"),
      "utf-8"
    );
    expect(navLinksSrc).toMatch(/href:\s*"\/quiz\/(\?[^"]*)?"/);
  });

  // @spec: 002-calm-profile-quiz @regression
  it("the EN/PL/UK privacy policies each list every field POST /leads persists", () => {
    // Mirrors the Lead columns asserted server-side in
    // kumo_back-end/test/leads/leads.test.ts ("stores no column capable of
    // holding the Q4/Q5 answers"): email, profile name, platform, consent.
    // The "email" word itself isn't a language-neutral marker (PL: "e-mail",
    // UK: Cyrillic), so each locale checks its own local word for it.
    const fields = [
      { label: "EN", path: "en/privacy-policy/index.html", emailWord: /email/i },
      { label: "PL", path: "pl/privacy-policy/index.html", emailWord: /e-mail/i },
      { label: "UK", path: "uk/privacy-policy/index.html", emailWord: /пошт/i },
    ];
    for (const { path: relPath, emailWord } of fields) {
      const html = read(relPath);
      expect(html).toMatch(emailWord);
      // The example profile name ("sleep" or "anxiety") is kept verbatim,
      // untranslated, in all three locales' Calm Profile Quiz section.
      expect(html).toMatch(/sleep|anxiety/);
      expect(html).toMatch(/iPhone|Android/);
      // "consent" (EN) / "zgod-" (PL) / "згод-" (UK) — the fact of consent
      // and what was agreed to.
      expect(html).toMatch(/consent|zgod|згод/i);
    }
  });

  // @spec: 002-calm-profile-quiz @regression
  it("has no no-cors fetch left in the capture client", () => {
    // Excludes src/test: this very file's own comments/strings documenting
    // the check would otherwise self-match.
    const result = execSync(
      'grep -r "no-cors" src/ --exclude-dir=test || true',
      { cwd: ROOT, encoding: "utf-8" }
    );
    expect(result.trim()).toBe("");
  });
});
