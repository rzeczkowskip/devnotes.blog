import hljsPowershell from 'highlight.js/lib/languages/powershell';
import hljsTwig from 'highlight.js/lib/languages/twig';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import rehypeExternalLinks, {
  Options as ExternalLinksOptions,
} from 'rehype-external-links';
import rehypeHighlight, { Options as HighlightOptions } from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import remarkUnwrapImages from 'remark-unwrap-images';
import rehypeCallout from '@/components/devnotesV2/MarkdownContent/rehype/rehype-callout';

export const rehypePlugins: ReactMarkdownOptions['rehypePlugins'] = [
  // @ts-ignore
  rehypeCallout,
  [
    rehypeExternalLinks,
    {
      target: '_blank',
      rel: ['noopener'],
    } as ExternalLinksOptions,
  ],
  [
    rehypeHighlight,
    {
      languages: {
        powershell: hljsPowershell,
        twig: hljsTwig,
      },
    } as HighlightOptions,
  ],
];

export const remarkPlugins: ReactMarkdownOptions['remarkPlugins'] = [
  remarkGfm,
  remarkUnwrapImages,
];
