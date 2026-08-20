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
  }),
});

export const collections = { blog };
