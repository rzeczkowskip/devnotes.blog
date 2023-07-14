import path from 'path';
import copyfiles from 'copyfiles';
import container from '../config/container';

const contentDir = path.relative(
  process.cwd(),
  container.get('params.content_dir'),
);
const up = contentDir.replace(/^\/*|\/*$/, '').split('/').length;

copyfiles(
  [`${contentDir}/**/*`, 'out'],
  {
    exclude: ['**/*.md'],
    up,
  },
  (error?: Error) => {
    if (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exit(1);
    }
  },
);
