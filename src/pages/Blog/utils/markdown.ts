import { marked } from 'marked';

export const renderMarkdown = (markdown: string): string => {
  return marked.parse(markdown) as string;
};

export const stripMarkdown = (markdown: string, limit = 150): string => {
  const plain = markdown.replace(/[#*`>_\-~]/g, '').replace(/\n/g, ' ');
  return plain.length > limit ? plain.slice(0, limit) + '...' : plain;
};