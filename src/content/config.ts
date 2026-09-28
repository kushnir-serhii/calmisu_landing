import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    image: z.string().optional(), // root-relative, e.g. /images/foo.png
    imageAlt: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    authorName: z.string().default("Calmisu Team"),
    authorBio: z
      .string()
      .default("Notes on anxiety, attention, and calm, practical tools."),
    // Optional post FAQ, rendered as an accordion (FAQAccordion) and emitted
    // as FAQPage JSON-LD — single source of truth, same pattern as the
    // homepage's src/data/faq.ts. Omit the "## FAQ" heading from the body
    // when using this; write questions/answers here instead.
    faq: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .optional(),
    // Opts a post into the mid-article quiz teaser (src/components/blog/
    // QuizTeaser.astro). Picks both the headline hook and which Q1 tile
    // renders pre-lit; "default" shows the generic hook with no lit tile.
    // Posts that omit this field get no teaser at all — opt-in, not a
    // tag-derived default (see the Change Log in
    // context/spec/002-calm-profile-quiz/functional-spec.md).
    quizCta: z
      .enum(["panic", "anxiety", "racingThoughts", "sleep", "default"])
      .optional(),
  }),
});

export const collections = { blog };
