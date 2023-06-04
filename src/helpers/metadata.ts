import { Metadata } from 'next';
import container from '../../config/container';
import Content from '@/services/content/Content';
import { ContentItem } from '@/types/Content';
import { Site } from '@/types/SiteConfig';

type Generator = (params: { params?: { path?: string | string[] } }) => Promise<Metadata>;

const getContentItem = (uri: string | string[]): ContentItem | undefined => {
  try {
    const page = container.get<Content>('content').getPage(uri);
    return page.contentItem;
  } catch (e) {
    return undefined;
  }
};

const getCanonicalUrl = (uri: string, baseUrl: string) => (uri.includes('://') ? uri : new URL(uri, baseUrl).toString());

const getMetadataGenerator = (fallbackTitle?: string, uri?: string): Generator => {
  const { baseUrl, title: siteTitle } = container.get<Site>('params.site_config');
  const isProd = container.get('params.is_prod');

  return async ({ params } = {}): Promise<Metadata> => {
    const contentItem = getContentItem(uri || params?.path || '');
    const title = contentItem?.title || fallbackTitle;

    return {
      title: title && title !== siteTitle ? `${title} | ${siteTitle}` : siteTitle,
      description: !contentItem ? undefined : (contentItem?.metadata?.summary || siteTitle),
      robots: !isProd || !contentItem || contentItem.draft ? 'noindex,nofollow' : undefined,
      alternates: {
        canonical: contentItem ? getCanonicalUrl(contentItem.canonicalUri, baseUrl) : undefined,
      },
    };
  };
};

export default getMetadataGenerator;
