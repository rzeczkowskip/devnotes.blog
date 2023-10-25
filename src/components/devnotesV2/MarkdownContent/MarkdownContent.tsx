import React from 'react';
import ReactMarkdown from 'react-markdown';
import Callout from '@/components/devnotesV2/Callout';
import Image from '@/components/devnotesV2/Image';
import {
  remarkPlugins,
  rehypePlugins,
} from '@/components/devnotesV2/MarkdownContent/markdownConfig';

type ArticleContentProps = {
  markdown: string;
  assetBaseUri: string;
};

const ArticleContent: React.FC<ArticleContentProps> = ({
  markdown,
  assetBaseUri,
}) => (
  <ReactMarkdown
    remarkPlugins={remarkPlugins}
    rehypePlugins={rehypePlugins}
    components={{
      img: ({ src, alt, title, ...props }) => (
        <Image
          src={src}
          alt={alt || ''}
          baseUri={assetBaseUri}
          title={title}
          priority={(props.node.position?.start.line || 11) < 10}
          className="mx-auto rounded"
        />
      ),
      // @ts-ignore
      callout: ({ children, type, title }) => (
        <Callout type={type || ''} title={title}>
          {children}
        </Callout>
      ),
    }}
  >
    {markdown}
  </ReactMarkdown>
);

export default ArticleContent;
