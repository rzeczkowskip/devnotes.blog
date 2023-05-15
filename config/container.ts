import path from 'path';
import Container from 'dinjectease';
import sitesConfig from './sites';
import ContentGenerator from '@/services/content/ContentGenerator';
import ContentLoader from '@/services/content/ContentLoader';
import ContentProcessor from '@/services/content/ContentProcessor';
import ContentRepositoryFactory from '@/services/content/ContentRepositoryFactory';
import ListingGenerator from '@/services/content/Generator/ListingGenerator';
import NullGenerator from '@/services/content/Generator/NullGenerator';
import TaxonomyGenerator from '@/services/content/Generator/TaxonomyGenerator';
import SlugGenerator from '@/services/content/SlugGenerator';
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
    c.get<ContentGenerator[]>('content.generators'),
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

container.set('content.generator.taxonomy', (c) => new TaxonomyGenerator(
  c.get<ContentProcessor>('content.processor'),
));

container.set('content.generator.listing', (c) => {
  const { taxonomyCollections, pagination } = c.get<Site>('params.site_config');

  if (!pagination) {
    return new NullGenerator();
  }

  return new ListingGenerator(pagination, taxonomyCollections ? Object.keys(taxonomyCollections) : []);
});

container.set('content.generators', (c) => [
  c.get<TaxonomyGenerator>('content.generator.taxonomy'),
  c.get<TaxonomyGenerator>('content.generator.listing'),
] as ContentGenerator[]);
