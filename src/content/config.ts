import { z, defineCollection } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:    z.string(),
    date:     z.coerce.date(),
    tags:     z.array(z.string()),
    excerpt:  z.string(),
    readTime: z.string(),
    featured: z.boolean().default(false),
    author:   z.string().default('Shantayya Swami'),
    image:    z.string().optional(),
    draft:    z.boolean().default(false),
  }),
});

export const collections = { blog };
