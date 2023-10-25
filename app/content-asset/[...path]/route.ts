import fs from 'fs';
import path from 'path';
import { AppRouteRouteHandlerContext } from 'next/dist/server/future/route-modules/app-route/module';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import container from '../../../config/container';
import { convertPathToParam, getAssetPaths } from '@/helpers/staticParams';

const getAsset = (assetPath: string): false | Buffer => {
  if (
    !assetPath ||
    !fs.existsSync(assetPath) ||
    !fs.statSync(assetPath).isFile()
  ) {
    return false;
  }

  try {
    return fs.readFileSync(assetPath);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    return false;
  }
};

// eslint-disable-next-line import/prefer-default-export
export const GET = async (
  req: NextRequest,
  ctx: AppRouteRouteHandlerContext,
): Promise<void | Response> => {
  const { path: pathParam } = ctx?.params || {};

  if (!pathParam || pathParam === '_') {
    return notFound();
  }

  const assetPath = Array.isArray(pathParam)
    ? path.join(...pathParam)
    : pathParam;

  const contentDir = container.get<string>('params.content_dir');
  const asset = getAsset(path.join(contentDir, assetPath));

  if (!asset) {
    return notFound();
  }

  return new NextResponse(asset);
};

export const generateStaticParams = async () => {
  if (container.get('params.is_dev')) {
    return getAssetPaths().map((p) => convertPathToParam(p));
  }

  return [{ path: ['_'] }];
};
