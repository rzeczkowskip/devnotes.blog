import fs from 'fs';
import path from 'path';
import { AppRouteHandlerFn } from 'next/dist/server/future/route-modules/app-route/module';
import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';
import container from '../../../config/container';
//
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
export const GET: AppRouteHandlerFn = async (req, ctx) => {
  const { path: pathParam } = ctx?.params || {};

  if (!pathParam) {
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
