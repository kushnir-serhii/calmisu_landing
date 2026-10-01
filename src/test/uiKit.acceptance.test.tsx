import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { readdirSync } from "fs";
import path from "path";
import type { FormEvent } from "react";

vi.mock("@/lib/analytics", () => ({ track: vi.fn() }));

import { track } from "@/lib/analytics";
import { PLAY_URL } from "@/constants/links";
import UiKitIsland from "@/components/ui-kit/UiKitIsland";
import { kitGroups } from "@/components/ui-kit/kitGroups";
import { Button } from "@/components/ui/button";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { DownloadButtons } from "@/components/ui/DownloadButtons";
import { PlanGate } from "@/components/quiz/PlanGate";

/**
 * Acceptance coverage for the whole UI component gallery (spec 003): the
 * /ui-kit/ island rendered through jsdom, plus the merged Button / Badge /
 * Input as the real pages use them. Build-output checks live in
 * uiKit.build.acceptance.test.ts.
 *
 * @spec: 003-ui-component-gallery
 */

const LABEL_SELECTOR = "span.text-xs.text-muted-foreground";

/** Label text of every example cell inside a section. */
function labelsOf(section: HTMLElement): string[] {
  return Array.from(section.querySelectorAll(LABEL_SELECTOR)).map((el) => el.textContent ?? "");
}

/** The example container (the element holding the demo) next to a label. */
function cellOf(section: HTMLElement, label: string): HTMLElement {
  const span = Array.from(section.querySelectorAll(LABEL_SELECTOR)).find(
    (el) => el.textContent === label,
  );
  if (!span) throw new Error(`No example labelled "${label}"`);
  return span.nextElementSibling as HTMLElement;
}

let container: HTMLElement;
function section(id: string): HTMLElement {
  const el = container.querySelector<HTMLElement>(`section#${id}`);
  if (!el) throw new Error(`No section #${id}`);
  return el;
}

beforeEach(() => {
  vi.mocked(track).mockClear();
  // jsdom lacks CSS.supports (AnimatedSectionDemo feature-detects with it).
  const css = (globalThis as unknown as { CSS?: Record<string, unknown> }).CSS;
  if (css && typeof css.supports !== "function") css.supports = () => false;
});

describe("UI kit island", () => {
  beforeEach(() => {
    container = render(<UiKitIsland />).container;
  });

  // @spec: 003-ui-component-gallery @regression
  describe("groups and nav", () => {
    it("lists every group in the sidebar and every href matches a rendered section id", () => {
      const nav = screen.getAllByRole("navigation", { name: "Components" })[0];
      for (const group of kitGroups) {
        expect(within(nav).getAllByText(group.title).length).toBeGreaterThan(0);
      }
      const hrefs = Array.from(nav.querySelectorAll("a")).map((a) => a.getAttribute("href"));
      expect(hrefs.length).toBeGreaterThanOrEqual(kitGroups.length);
      for (const href of hrefs) {
        expect(href).toMatch(/^#/);
        expect(container.querySelector(`section${href}`)).not.toBeNull();
      }
      for (const group of kitGroups) {
        const sec = section(group.id);
        expect(within(sec).getByRole("heading", { level: 2, name: group.title })).toBeInTheDocument();
        expect(sec.textContent).toContain(group.description);
      }
    });

    it("has one Input group and no Email field / Text input group", () => {
      const titles = kitGroups.map((g) => g.title);
      expect(titles.filter((t) => t === "Input")).toHaveLength(1);
      expect(titles).not.toContain("Email field");
      expect(titles).not.toContain("Text input");
    });
  });

  // @spec: 003-ui-component-gallery @regression
  describe("Button group", () => {
    it("shows 12 labelled cells and none names a removed style or size", () => {
      const labels = labelsOf(section("button"));
      expect(labels).toHaveLength(12);
      for (const label of labels) {
        expect(label.length).toBeGreaterThan(0);
        expect(label).not.toMatch(/\b(outline|secondary|ghost|default|large|small|xl|extra)\b/i);
        expect(label).not.toMatch(/^link\b/i);
      }
    });

    it("renders both store cells with the icon svg after the text", () => {
      const sec = section("button");
      for (const label of ["Store (iOS) · Standard", "Store (Google Play) · Standard"]) {
        const btn = cellOf(sec, label).querySelector("button") as HTMLButtonElement;
        const nodes = Array.from(btn.childNodes);
        const textIdx = nodes.findIndex(
          (n) => n.nodeType === Node.TEXT_NODE && n.textContent === "Store",
        );
        const svgIdx = nodes.findIndex(
          (n) => n instanceof Element && (n.tagName === "svg" || n.querySelector("svg") !== null),
        );
        expect(textIdx).toBeGreaterThanOrEqual(0);
        expect(svgIdx).toBeGreaterThan(textIdx);
      }
    });

    it("has one faded, disabled example per style", () => {
      const sec = section("button");
      for (const label of ["Dark · Disabled", "Destructive · Disabled", "Store (iOS) · Disabled"]) {
        const btn = cellOf(sec, label).querySelector("button") as HTMLButtonElement;
        expect(btn).toBeDisabled();
        expect(btn.className).toContain("disabled:opacity-50");
      }
    });

    it("does not call a handler when a disabled button is clicked", () => {
      const onClick = vi.fn();
      render(
        <Button disabled onClick={onClick}>
          Nope
        </Button>,
      );
      fireEvent.click(screen.getByRole("button", { name: "Nope" }));
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  // @spec: 003-ui-component-gallery @regression
  describe("Badge group", () => {
    it("shows 4 labelled cells, all one fill / text colour / pill shape, none with removed styles", () => {
      const sec = section("badge");
      const labels = labelsOf(sec);
      expect(labels).toEqual(["Small", "Medium", "Large", "With dot · Large"]);
      for (const label of labels) {
        const badge = cellOf(sec, label).firstElementChild as HTMLElement;
        const cls = badge.className;
        expect(cls).toContain("bg-brand-100");
        expect(cls).toContain("text-brand-dark");
        expect(cls).toContain("rounded-full");
        expect(cls).not.toContain("bg-primary");
        expect(cls).not.toContain("bg-destructive");
        expect(cls).not.toMatch(/(^|\s)border/);
      }
    });

    it("puts the PulseDot with a motion-safe animation in the dot cell only", () => {
      const sec = section("badge");
      const dot = cellOf(sec, "With dot · Large").querySelector(
        "span[aria-hidden='true']",
      ) as HTMLElement;
      expect(dot).not.toBeNull();
      expect(dot.className).toContain("motion-safe:animate-");
      expect(cellOf(sec, "Large").querySelector("span[aria-hidden='true']")).toBeNull();
    });
  });

  // @spec: 003-ui-component-gallery @regression
  describe("Input group", () => {
    it("shows 7 labelled cells, no file picker, all sharing the standard height, corners and border", () => {
      const sec = section("input");
      expect(labelsOf(sec)).toEqual([
        "Empty · placeholder",
        "Filled",
        "Disabled",
        "Error",
        "With label",
        "Email",
        "Password",
      ]);
      const inputs = Array.from(sec.querySelectorAll("input"));
      expect(inputs).toHaveLength(7);
      for (const input of inputs) {
        expect(input.getAttribute("type")).not.toBe("file");
        expect(input.className).toContain("h-10");
        expect(input.className).toContain("rounded-md");
        expect(input.className).toMatch(/(^|\s)border(\s|$)/);
      }
    });

    it("associates the label with its input, so clicking the label focuses it", () => {
      const sec = section("input");
      const label = within(sec).getByText("Email", { selector: "label" });
      const input = sec.querySelector("#ui-kit-input-with-label") as HTMLInputElement;
      // jsdom does not move focus on a label click; the browser does exactly
      // when label.control resolves to this input.
      expect((label as HTMLLabelElement).control).toBe(input);
    });

    it("disables the disabled example and lets enabled examples be typed into", () => {
      const sec = section("input");
      expect(cellOf(sec, "Disabled").querySelector("input")).toBeDisabled();
      const input = cellOf(sec, "Empty · placeholder").querySelector("input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "hello" } });
      expect(input.value).toBe("hello");
    });

    it("renders the error example with aria-invalid, the red-border class and a visible message", () => {
      const cell = cellOf(section("input"), "Error");
      const input = cell.querySelector("input") as HTMLInputElement;
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(input.className).toContain("aria-[invalid=true]:border-destructive");
      expect(within(cell).getByRole("alert")).toHaveTextContent("Enter a valid email address.");
    });
  });

  // @spec: 003-ui-component-gallery @regression
  describe("Form group", () => {
    it("shows a field with helper text and a field with an error; FormControl drives aria-invalid", async () => {
      const sec = section("form");
      expect(labelsOf(sec)).toEqual(["With description", "With error"]);
      expect(sec.textContent).toContain("We will never share your email.");
      const [plain, errored] = Array.from(sec.querySelectorAll("input"));
      expect(plain).toHaveAttribute("aria-invalid", "false");
      await waitFor(() => expect(errored).toHaveAttribute("aria-invalid", "true"));
      expect(sec.textContent).toContain("Please enter a valid email address.");
    });
  });

  // @spec: 003-ui-component-gallery @regression
  describe("SelectCard group", () => {
    it("has 13 cards and 4 indicator examples, and clicking toggles a card on and off", () => {
      const sec = section("select-card");
      const cards = sec.querySelectorAll("button[aria-pressed]");
      expect(cards).toHaveLength(13);
      const labels = labelsOf(sec);
      expect(labels).toHaveLength(17);
      expect(
        labels.filter((l) => /^(Checkbox|Radio) · (Checked|Unchecked)$/.test(l)),
      ).toHaveLength(4);
      expect(sec.querySelector("img")).not.toBeNull();

      const card = cellOf(sec, "Left · No indicator · Unselected").querySelector(
        "button",
      ) as HTMLElement;
      expect(card).toHaveAttribute("aria-pressed", "false");
      fireEvent.click(card);
      expect(card).toHaveAttribute("aria-pressed", "true");
      fireEvent.click(card);
      expect(card).toHaveAttribute("aria-pressed", "false");
    });
  });

  // @spec: 003-ui-component-gallery @regression
  describe("Download buttons group", () => {
    it("has 4 labelled examples; iOS click opens nothing; Android links to Google Play; no tracking", () => {
      const sec = section("download-buttons");
      expect(labelsOf(sec)).toEqual(["Row", "Column", "iOS only", "Android only"]);
      const ios = within(cellOf(sec, "iOS only")).getByRole("button", {
        name: /Join iOS Waitlist/,
      });
      fireEvent.click(ios);
      expect(screen.queryByRole("dialog")).toBeNull();
      const android = within(cellOf(sec, "Android only")).getByRole("link", {
        name: /Download for Android/,
      });
      expect(android).toHaveAttribute("target", "_blank");
      expect(android).toHaveAttribute("href", PLAY_URL);
      fireEvent.click(android);
      expect(track).not.toHaveBeenCalled();
    });
  });

  // @spec: 003-ui-component-gallery @regression
  describe("FAQ group", () => {
    it("opens the first item, moves the open item on click, and closes all when the open one is clicked", () => {
      const triggers = within(section("faq")).getAllByRole("button");
      expect(triggers).toHaveLength(3);
      const open = () => triggers.map((t) => t.getAttribute("aria-expanded"));
      expect(open()).toEqual(["true", "false", "false"]);
      fireEvent.click(triggers[1], { button: 0 });
      expect(open()).toEqual(["false", "true", "false"]);
      fireEvent.click(triggers[1], { button: 0 });
      expect(open()).toEqual(["false", "false", "false"]);
    });
  });

  // @spec: 003-ui-component-gallery @regression
  describe("Dialog group", () => {
    it("opens with title, description and footer, and closes on Escape", async () => {
      fireEvent.click(within(section("dialog")).getByRole("button", { name: "Open dialog" }));
      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByText("Confirm action")).toBeInTheDocument();
      expect(within(dialog).getByText(/cannot be undone/)).toBeInTheDocument();
      expect(within(dialog).getByRole("button", { name: "Cancel" })).toBeInTheDocument();
      expect(within(dialog).getByRole("button", { name: "Confirm" })).toBeInTheDocument();
      fireEvent.keyDown(dialog, { key: "Escape" });
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    });
  });

  // @spec: 003-ui-component-gallery @regression
  describe("Toasts group", () => {
    it("shows each trigger's toast text and the action button dismisses its toast", async () => {
      const sec = section("toasts");
      const click = (label: string) =>
        fireEvent.click(within(cellOf(sec, label)).getByRole("button"));
      click("Plain");
      click("With description");
      click("Success");
      click("Error");
      click("With action (closes the toast)");
      for (const text of [
        "Saved",
        "Plan sent",
        "Check your inbox.",
        "Profile updated",
        "Something went wrong",
        "Item archived",
      ]) {
        expect(await screen.findByText(text)).toBeInTheDocument();
      }
      fireEvent.click(screen.getByRole("button", { name: "Undo" }));
      await waitFor(() => expect(screen.queryByText("Item archived")).toBeNull());
      expect(screen.getByText("Saved")).toBeInTheDocument();
    });
  });

  // @spec: 003-ui-component-gallery @regression
  describe("Icons and flags groups", () => {
    it("labels 3 icons and 12 flag cells", () => {
      const icons = section("icons");
      expect(labelsOf(icons)).toEqual(["Check", "Apple", "Google Play"]);
      expect(icons.querySelectorAll("svg")).toHaveLength(3);
      const flags = labelsOf(section("flags"));
      expect(flags).toHaveLength(12);
      for (const lang of ["Spanish", "Polish", "Ukrainian", "English (UK)"]) {
        for (const size of [16, 32, 48]) expect(flags).toContain(`${lang} · ${size}px`);
      }
    });
  });
});

// @spec: 003-ui-component-gallery @regression
describe("buttons on real pages", () => {
  it("DownloadButtons default renders the iOS button and the Android link with the standard classes", () => {
    render(<DownloadButtons location="hero" onIosClick={() => {}} />);
    const ios = screen.getByRole("button", { name: /Join iOS Waitlist/ });
    const android = screen.getByRole("link", { name: /Download for Android/ });
    expect(ios.tagName).toBe("BUTTON");
    expect(android).toHaveAttribute("target", "_blank");
    expect(android).toHaveAttribute("href", PLAY_URL);
    for (const el of [ios, android]) {
      for (const cls of ["h-[54px]", "rounded-xl", "bg-foreground", "cta-btn"]) {
        expect(el.className).toContain(cls);
      }
    }
  });

  it("tracks cta_click with platform and location, and never when trackClicks is false", () => {
    const { unmount } = render(<DownloadButtons location="hero" onIosClick={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Join iOS Waitlist/ }));
    expect(track).toHaveBeenCalledWith("cta_click", { platform: "ios", location: "hero" });
    fireEvent.click(screen.getByRole("link", { name: /Download for Android/ }));
    expect(track).toHaveBeenCalledWith("cta_click", { platform: "android", location: "hero" });
    unmount();

    vi.mocked(track).mockClear();
    render(<DownloadButtons location="ui_kit" trackClicks={false} onIosClick={() => {}} />);
    fireEvent.click(screen.getByRole("button", { name: /Join iOS Waitlist/ }));
    fireEvent.click(screen.getByRole("link", { name: /Download for Android/ }));
    expect(track).not.toHaveBeenCalled();
  });

  it("plain and destructive Buttons are 54px rounded-xl; the pill size is rounded-full", () => {
    render(
      <>
        <Button>Plain</Button>
        <Button variant="destructive">Delete</Button>
        <Button size="pill">Start</Button>
      </>,
    );
    for (const name of ["Plain", "Delete"]) {
      const cls = screen.getByRole("button", { name }).className;
      expect(cls).toContain("h-[54px]");
      expect(cls).toContain("rounded-xl");
    }
    expect(screen.getByRole("button", { name: "Start" }).className).toContain("rounded-full");
  });
});

// @spec: 003-ui-component-gallery @regression
describe("badges on real pages", () => {
  it("<Badge size='md'> renders a span", () => {
    render(<Badge size="md">pill</Badge>);
    expect(screen.getByText("pill").tagName).toBe("SPAN");
  });

  it("badgeVariants returns the sm / md / lg size classes", () => {
    expect(badgeVariants({ size: "sm" })).toContain("px-3 py-1 text-xs");
    expect(badgeVariants({ size: "md" })).toContain("px-3 py-1 text-sm sm:text-base");
    const lg = badgeVariants({ size: "lg" });
    expect(lg).toContain("px-3 sm:px-4 py-2 sm:py-3");
    expect(lg).toContain("text-base sm:text-lg");
    for (const size of ["sm", "md", "lg"] as const) {
      expect(badgeVariants({ size })).toContain("bg-brand-100");
    }
  });
});

// @spec: 003-ui-component-gallery @regression
describe("inputs on real pages", () => {
  it("type=email carries the email defaults and is not required", () => {
    render(<Input type="email" aria-label="e" />);
    const input = screen.getByLabelText("e");
    expect(input).toHaveAttribute("autocomplete", "email");
    expect(input).toHaveAttribute("inputmode", "email");
    expect(input).toHaveAttribute("autocapitalize", "none");
    expect(input).toHaveAttribute("spellcheck", "false");
    expect(input).toHaveAttribute("maxlength", "254");
    expect(input).not.toBeRequired();
  });

  it("<Input error> sets aria-invalid and keeps the red-border class", () => {
    render(<Input error aria-label="e" />);
    const input = screen.getByLabelText("e");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.className).toContain("aria-[invalid=true]:border-destructive");
  });

  it("PlanGate in the error state marks the email input invalid and points at the message", () => {
    const props = {
      platform: "ios" as const,
      onPlatformChange: () => {},
      email: "bad",
      onEmailChange: () => {},
      consent: true,
      onConsentChange: () => {},
      error: "Enter a valid email",
      onSubmit: (e: FormEvent) => e.preventDefault(),
    };
    const { rerender } = render(<PlanGate {...props} status="error" />);
    const input = screen.getByLabelText("Email address");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "quiz-gate-error");
    expect(document.getElementById("quiz-gate-error")).toHaveTextContent("Enter a valid email");

    rerender(<PlanGate {...props} status="idle" />);
    expect(screen.getByLabelText("Email address")).not.toHaveAttribute("aria-invalid", "true");
  });
});

// @spec: 003-ui-component-gallery @regression
describe("gallery completeness", () => {
  it("every file under src/components/ui is covered by some kitGroups entry", () => {
    const uiDir = path.resolve(__dirname, "../components/ui");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(tsx|astro)$/.test(entry.name)) {
          const rel = path.relative(uiDir, full).split(path.sep).join("/");
          files.push(rel.replace(/\.tsx$/, ""));
        }
      }
    };
    walk(uiDir);
    expect(files.length).toBeGreaterThan(10);
    const covered = new Set(kitGroups.flatMap((g) => g.covers));
    const missing = files.filter((f) => !covered.has(f));
    expect(missing).toEqual([]);
  });
});
