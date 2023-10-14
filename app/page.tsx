import React from 'react';
import container from '../config/container';
import PageContent from '@/components/devnotesV2/PageContent';
import getMetadataGenerator from '@/helpers/metadata';
import Content from '@/services/content/Content';
import { Site } from '@/types/SiteConfig';

export const generateMetadata = getMetadataGenerator(undefined, '/');

const Homepage = async () => {
  const contentLoader = container.get<Content>('content');
  const { title } = container.get<Site>('params.site_config');

  const page = contentLoader.getPageWithFallback(
    '/',
    contentLoader.getDummyPage('pages', title, '/'),
  );

  return <PageContent page={page} />;
};

export default Homepage;
