import { MDXProvider } from '@mdx-js/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { mdxComponents } from './mdx';
import { PostMeta } from './posts';

export const renderPost = async (fileName: string): Promise<{ content: string; metadata: PostMeta }> => {
  const { default: Content, metadata = {} } = await import(`../posts/${fileName}`);
  const content = renderToStaticMarkup(
    <MDXProvider components={mdxComponents}>
      <Content />
    </MDXProvider>
  )

  return { content, metadata };
}
