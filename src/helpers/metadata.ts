import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import container from '../../config/container';
import Content from '@/services/content/Content';
import { Site } from '@/types/SiteConfig';

type Generator = (params?: { params?: { path?: string | string[] } }) => Promise<Metadata>;

const getMetadataGenerator = (fallbackTitle?: string, uri?: string): Generator => {
  const { baseUrl, title: siteTitle } = container.get<Site>('params.site_config');

  return async ({ params } = {}): Promise<Metadata> => {
    try {
      const { contentItem } = container.get<Content>('content').getPage(uri || params?.path || '') || {};

      const title = contentItem?.title || fallbackTitle;

      return {
        title: title && title !== siteTitle ? `${title} | ${siteTitle}` : siteTitle,
        metadataBase: new URL(contentItem?.uri || '/', baseUrl),
        robots: !contentItem || contentItem.draft ? 'noindex,nofollow' : undefined,
        alternates: {
          canonical: contentItem?.metadata?.canonicalUri,
        },
      };
    } catch (e) {
      notFound();
      return {};
    }
  };
};

export default getMetadataGenerator;
