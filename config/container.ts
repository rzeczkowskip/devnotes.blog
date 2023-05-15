import path from 'path';
import Container from 'dinjectease';
import sitesConfig from './sites';
import ContentLoader from '@/services/content/ContentLoader';
import ContentProcessor from '@/services/content/ContentProcessor';
import ContentRepositoryFactory from '@/services/content/ContentRepositoryFactory';
import SlugGenerator from '@/services/content/SlugGenerator';
import TaxonomyGenerator from '@/services/content/TaxonomyGenerator';
import { Site } from '@/types/SiteConfig';

const container = new Container();

export default container;

const siteCode = process.env.SITE || 'default';
const siteConfig = sitesConfig.sites[siteCode];

container.raw('params.site_config', siteConfig);
container.set('params.content_dir', (c) => {
  const { contentDir } = c.get('params.site_config');
  return path.normalize(path.join(process.cwd(), contentDir));
});

container.set('content.repository', (c) => {
  const factory = new ContentRepositoryFactory(
    c.get<ContentLoader>('content.loader'),
    c.get<ContentProcessor>('content.processor'),
    c.get<TaxonomyGenerator>('content.taxonomy_generator'),
    {
      includeDrafts: process.env.NODE_ENV !== 'production',
    },
  );

  return factory.createRepository();
});

container.set('content.loader', (c) => new ContentLoader(c.get('params.content_dir')));
container.set('content.processor', (c) => {
  const { taxonomyCollections } = c.get<Site>('params.site_config');

  return new ContentProcessor(
    taxonomyCollections || {},
    'posts',
    c.get<SlugGenerator>('content.slug_generator'),
  );
});

container.set('content.slug_generator', () => new SlugGenerator());

container.set('content.taxonomy_generator', (c) => new TaxonomyGenerator(
  c.get<ContentProcessor>('content.processor'),
));
