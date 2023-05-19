import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import Image from '@/components/ArticleContent/MarkdownComponents/Image';
import Prose from '@/components/Prose';

type ArticleContentProps = {
  markdown: string,
  assetBaseUri: string,
};

const ArticleContent: React.FC<ArticleContentProps> = ({ markdown, assetBaseUri }) => (
  <Prose>
    <ReactMarkdown
      remarkPlugins={ [remarkGfm, remarkUnwrapImages] }
      components={{
        img: ({
          src, alt, title, ...props
        }) => (
          src
            ? <Image
              src={ src }
              alt={ alt }
              baseUri={ assetBaseUri }
              title={ title }
              priority={ (props.node.position?.start.line || 11) < 10 }
            />
            : null
        ),
      }}
    >
      { markdown }
    </ReactMarkdown>
  </Prose>

);

export default ArticleContent;
