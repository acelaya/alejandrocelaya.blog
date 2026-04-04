import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { postMetaSchema } from './utils/posts.ts';

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/content/posts' }),
  schema: postMetaSchema,
});

// Export a single `collections` object to register your collection(s)
// This key should match your collection directory name in "src/content"
export const collections = { posts };
