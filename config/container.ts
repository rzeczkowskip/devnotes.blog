import path from 'path';
import Container from 'dinjectease';
import sitesConfig from './sites';

const container = new Container();

export default container;

const siteCode = process.env.SITE || 'default';

container.raw('params.site_config', sitesConfig.sites[siteCode]);
container.set('params.content_dir', (c) => {
  const { contentDir } = c.get('params.site_config');
  return path.normalize(path.join(process.cwd(), contentDir));
});
