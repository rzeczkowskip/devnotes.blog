import fs from 'fs';
import nodePath from 'path';
import { notFound, redirect } from 'next/navigation';
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

const isAssetPath = (path: string[]): boolean => {
  const contentDir = container.get<string>('params.content_dir');

  return fs.existsSync(nodePath.join(contentDir, ...path));
};

const Page = async (props: PageProps) => {
  if (!props?.params?.path) {
    return notFound();
  }

  const { path } = props.params;

  try {
    const contentLoader = container.get<Content>('content');
    const page = contentLoader.getPage(path);

    return (<ContentLayout page={page}/>);
  } catch (e) {
    if (e instanceof Error && e.message.endsWith(' not found.')) {
      return isAssetPath(path) ? redirect(`/content-asset/${path.join('/')}`) : notFound();
    }

    throw e;
  }
};

export const generateStaticParams = async (): Promise<PageParams[]> => container
  .get<ContentRepository>('content.repository')
  .uris
  .filter((uri) => uri !== '/')
  .map((uri) => ({
    path: uri.replace(/^\//, '').split('/'),
  }));

export default Page;
