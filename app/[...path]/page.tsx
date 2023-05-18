import { notFound } from 'next/navigation';
import React from 'react';
import container from '../../config/container';
import ContentLayout from '@/components/ContentLayout';
import getMetadataGenerator from '@/helpers/metadata';
import Content from '@/services/content/Content';
import ContentRepository from '@/services/content/ContentRepository';

export const generateMetadata = getMetadataGenerator();

type PageParams = {
  path: string[],
};

type PageProps = {
  params?: PageParams,
};

const Page = async (props: PageProps) => {
  if (!props?.params?.path) {
    return notFound();
  }

  const contentLoader = container.get<Content>('content');
  const page = contentLoader.getPage(props.params.path);

  return (<ContentLayout page={ page } />);
};

export const generateStaticParams = async (): Promise<PageParams[]> => container
  .get<ContentRepository>('content.repository')
  .uris
  .filter((uri) => uri !== '/')
  .map((uri) => ({
    path: uri.replace(/^\//, '').split('/'),
  }));

export default Page;
