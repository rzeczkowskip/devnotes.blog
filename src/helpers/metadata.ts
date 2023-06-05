import { Metadata } from 'next';
import { AlternateURLs } from 'next/dist/lib/metadata/types/alternative-urls-types';
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

const getLangUrls = (langsConfig?: Record<string, unknown>): AlternateURLs['languages'] => {
  if (!langsConfig || typeof langsConfig !== 'object') {
    return undefined;
  }

  const baseUrls = container.get('params.lang_base_urls');
  const allowedSites = Object.keys(baseUrls);

  const entries = Object.entries(langsConfig)
    .filter(([site]) => allowedSites.includes(site))
    .map(([site, value]) => {
      if (typeof value !== 'string') {
        return [site, undefined];
      }

      if (value.includes('//')) {
        return [site, value];
      }

      return [site, `${baseUrls[site]}/${value.replace(/^\/*/, '')}`];
    });

  return Object.fromEntries(entries);
};

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
        languages: getLangUrls(contentItem?.metadata?.langs),
      },
    };
  };
};

export default getMetadataGenerator;
