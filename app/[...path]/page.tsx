import { notFound, redirect } from 'next/navigation';
import React from 'react';
import container from '../../config/container';
import ContentLayout from '@/components/devnotesV2/ContentLayout';
import getMetadataGenerator from '@/helpers/metadata';
import {
  convertPathToParam,
  getAssetPaths,
  getContentPagesPaths,
  isAssetPath,
} from '@/helpers/staticParams';
import Content from '@/services/content/Content';

export const generateMetadata = getMetadataGenerator();

type PageParams = {
  path: string[];
};

type PageProps = {
  params?: PageParams;
};

const Page = async (props: PageProps) => {
  if (!props?.params?.path) {
    return notFound();
  }

  const { path } = props.params;

  if (isAssetPath(path)) {
    return redirect(`/content-asset/${path.join('/')}`);
  }

  try {
    const contentLoader = container.get<Content>('content');
    const page = contentLoader.getPage(path);

    return <ContentLayout page={page} />;
  } catch (e) {
    if (e instanceof Error && e.message.endsWith(' not found.')) {
      return notFound();
    }

    throw e;
  }
};

export const generateStaticParams = async (): Promise<PageParams[]> =>
  [
    ...getContentPagesPaths(),
    ...(container.get('params.is_prod') ? [] : getAssetPaths()),
  ].map((p) => convertPathToParam(p)) as PageParams[];
export default Page;
