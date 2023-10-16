import MarkdownIt from 'markdown-it';

const markdownParser = new MarkdownIt();

export const renderMarkdown = (body: string) => markdownParser.render(body);
