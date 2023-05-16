import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Container from '@/components/Container';

type ArticleContentProps = {
  markdown: string,
};

const ArticleContent: React.FC<ArticleContentProps> = ({ markdown }) => (
  <Container className="prose prose-slate">
    <article>
      <ReactMarkdown
        remarkPlugins={ [remarkGfm] }>
        { markdown }
      </ReactMarkdown>
    </article>
  </Container>

);

export default ArticleContent;
