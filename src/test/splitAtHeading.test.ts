import { describe, it, expect } from "vitest";
import { splitAtHeading } from "@/lib/splitAtHeading";

describe("splitAtHeading", () => {
  it("splits before the 3rd <h2 by default", () => {
    const html =
      "<p>a</p><h2 id=\"one\">One</h2><p>b</p><h2 id=\"two\">Two</h2><p>c</p><h2 id=\"three\">Three</h2><p>d</p>";
    const { before, after } = splitAtHeading(html);
    expect(before).toBe(
      "<p>a</p><h2 id=\"one\">One</h2><p>b</p><h2 id=\"two\">Two</h2><p>c</p>"
    );
    expect(after).toBe('<h2 id="three">Three</h2><p>d</p>');
    expect(before + after).toBe(html);
  });

  it("splits before the last <h2 when there are fewer than requested", () => {
    const html = "<p>a</p><h2>One</h2><p>b</p><h2>Two</h2><p>c</p>";
    const { before, after } = splitAtHeading(html);
    expect(before).toBe("<p>a</p><h2>One</h2><p>b</p>");
    expect(after).toBe("<h2>Two</h2><p>c</p>");
  });

  it("puts everything in `before` when there are no h2 tags", () => {
    const html = "<p>a</p><p>b</p>";
    const { before, after } = splitAtHeading(html);
    expect(before).toBe(html);
    expect(after).toBe("");
  });

  it("does not match tags like <h2foo (guarded lookahead)", () => {
    const html = "<h2foo>not a heading</h2foo><h2>real</h2>";
    const { before, after } = splitAtHeading(html, 1);
    expect(before).toBe("<h2foo>not a heading</h2foo>");
    expect(after).toBe("<h2>real</h2>");
  });

  it("honours a custom occurrence", () => {
    const html = "<h2>One</h2><p>a</p><h2>Two</h2><p>b</p>";
    const { before, after } = splitAtHeading(html, 2);
    expect(before).toBe("<h2>One</h2><p>a</p>");
    expect(after).toBe("<h2>Two</h2><p>b</p>");
  });
});
