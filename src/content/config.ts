import { defineCollection } from 'astro:content';
import { postMetaSchema } from '../utils/posts.ts';

const posts = defineCollection({
  type: 'content',
  schema: postMetaSchema,
});

// Export a single `collections` object to register your collection(s)
// This key should match your collection directory name in "src/content"
export const collections = { posts };
