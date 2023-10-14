import { renderToStaticMarkup } from 'react-dom/server';
import { mdxComponents } from './mdx';
import { PostMeta } from './posts';

interface RenderPostResult {
  content: string;
  metadata: PostMeta;
  summary: string;
}

export const renderPost = async (fileName: string): Promise<RenderPostResult> => {
  const { default: Content, metadata = {}, summary = '' } = await import(`../posts/${fileName}`);
  const content = renderToStaticMarkup(<Content components={mdxComponents}/>);

  return { content, metadata, summary };
}
