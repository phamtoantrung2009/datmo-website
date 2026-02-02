import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    category: z.enum(['kinh-nghiem-du-lich', 'tin-tuc-cam-pha', 'lich-tau-gia-ve']),
    tags: z.array(z.string()).default([]),
    canonical: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
