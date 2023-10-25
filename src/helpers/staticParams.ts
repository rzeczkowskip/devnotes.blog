import fs from 'fs';
import nodePath from 'path';
import { globSync } from 'glob';
import container from '../../config/container';
import ContentRepository from '@/services/content/ContentRepository';

export const isAssetPath = (path: string[]): boolean => {
  const contentDir = container.get<string>('params.content_dir');
  const fullPath = nodePath.join(contentDir, ...path);

  return (
    !!fullPath && fs.existsSync(fullPath) && fs.statSync(fullPath)?.isFile()
  );
};

export const convertPathToParam = (
  path: string,
  key = 'path',
): { [x: string]: string[] } => ({
  [key]: path.replace(/^\//, '').split('/'),
});

export const getContentPagesPaths = (): string[] =>
  container.get<ContentRepository>('content.repository').uris;

export const getAssetPaths = (): string[] => {
  const contentDir = container.get<string>('params.content_dir');

  return globSync('./**/*[!.md]', {
    cwd: contentDir,
    dot: false,
    nodir: true,
    absolute: false,
  });
};
