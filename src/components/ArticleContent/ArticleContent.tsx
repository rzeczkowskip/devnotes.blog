import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prose from '@/components/Prose';

type ArticleContentProps = {
  markdown: string,
};

const ArticleContent: React.FC<ArticleContentProps> = ({ markdown }) => (
  <Prose>
    <ReactMarkdown
      remarkPlugins={ [remarkGfm] }>
      { markdown }
    </ReactMarkdown>
  </Prose>

);

export default ArticleContent;
