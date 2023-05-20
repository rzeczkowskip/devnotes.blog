import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks, { Options as ExternalLinksOptions } from 'rehype-external-links';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import { visitParents } from 'unist-util-visit-parents';
import Callout from '@/components/Callout';
import ContentImage from '@/components/ContentImage';
import Prose from '@/components/Prose';

type ArticleContentProps = {
  markdown: string,
  assetBaseUri: string,
  image?: string,
};

// @ts-ignore
const rehypeCallout = () => (tree) => {
  visitParents(tree, 'element', (node) => {
    if (node.tagName !== 'blockquote' || !Array.isArray(node?.children)) {
      return;
    }

    // @ts-ignore
    const children = (node.children || []).filter((child) => !(child.type === 'text' && child.value === '\n'));
    const firstLine = children?.[0]?.value ? children?.[0] : children?.[0]?.children?.[0];

    if (!firstLine || firstLine.type !== 'text' || typeof firstLine.value !== 'string') {
      return;
    }

    const value = (firstLine.value as string).trim();
    const matches = value.match(/^\[!(\w+)] *(.*)\n/);

    if (!matches || matches.length < 3) {
      return;
    }

    const [toRemove, type, title] = matches;

    // eslint-disable-next-line no-param-reassign
    node.tagName = 'callout';
    // eslint-disable-next-line no-param-reassign
    node.properties = { title, type };
    firstLine.value = firstLine.value.replace(toRemove, '');
  });
};

const ArticleContent: React.FC<ArticleContentProps> = ({ markdown, assetBaseUri, image }) => (
    <>
      { image && (
        <ContentImage
          src={ image }
          alt=""
          baseUri={ assetBaseUri }
          className="rounded mx-auto mb-8"
          priority
        />
      ) }

      <Prose>
        <ReactMarkdown
          remarkPlugins={ [remarkGfm, remarkUnwrapImages] }
          rehypePlugins={ [
            rehypeCallout,
            [rehypeExternalLinks, { target: '_blank', rel: ['noopener'] } as ExternalLinksOptions],
          ] }
          components={{
            img: ({
              src, alt, title, ...props
            }) => (
              src
                ? <ContentImage
                  src={ src }
                  alt={ alt || '' }
                  baseUri={ assetBaseUri }
                  title={ title }
                  priority={ (props.node.position?.start.line || 11) < 10 }
                  className="mx-auto rounded"
                />
                : null
            ),
            // @ts-ignore
            callout: ({ children, type, title }) => (<Callout type={ type || '' } title={ title }>{ children }</Callout>),
          }}
        >
          { markdown }
        </ReactMarkdown>
      </Prose>
    </>
);

export default ArticleContent;
