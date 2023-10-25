import path from 'path';
import copyfiles from 'copyfiles';
import container from '../config/container';

const contentDir = path.relative(
  process.cwd(),
  container.get('params.content_dir'),
);

const paths = [`${contentDir}/**/*`, 'out'];
const options = {
  exclude: ['**/*.md'],
  up: contentDir.replace(/^\/*|\/*$/, '').split('/').length,
};

copyfiles(paths, options, (error?: Error) => {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(error, { paths, options });
    process.exit(1);
  }
});
