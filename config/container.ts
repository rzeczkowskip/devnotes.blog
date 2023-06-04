import path from 'path';
import Container from 'dinjectease';
import relatedContent from './relatedContent';
import sitesConfig from './sites';
import Content from '@/services/content/Content';
import ContentLoader from '@/services/content/ContentLoader';
import ContentProcessor from '@/services/content/ContentProcessor';
import ContentRepository from '@/services/content/ContentRepository';
import ContentRepositoryFactory from '@/services/content/ContentRepositoryFactory';
import RelatedContent from '@/services/content/RelatedContent';
import RepositoryItemsGenerator from '@/services/content/RepositoryItemsGenerator';
import ListingGenerator from '@/services/content/RepositoryItemsGenerator/ListingGenerator';
import NullGenerator from '@/services/content/RepositoryItemsGenerator/NullGenerator';
import TaxonomyGenerator from '@/services/content/RepositoryItemsGenerator/TaxonomyGenerator';
import ExcludeDraftsProcessor from '@/services/content/RepositoryItemsPreprocessor/ExcludeDraftsProcessor';
import SortPostprocessor from '@/services/content/RepositoryItemsPreprocessor/SortPostprocessor';
import RepositoryItemsProcessor from '@/services/content/RepositoryItemsProcessor';
import SlugGenerator from '@/services/content/SlugGenerator';
import Translator from '@/services/translation/Translator';
import { Site } from '@/types/SiteConfig';

const container = new Container();

export default container;

container.raw('params.app_env', process.env.APP_ENV || 'prod');
container.set('params.is_prod', (c) => c.get('params.app_env') === 'prod');
container.set('params.site_config', () => {
  const siteCode = process.env.SITE;

  if (!siteCode || !(siteCode in sitesConfig.sites)) {
    throw new Error(`Invalid site provided "${siteCode}", allowed sites are ${Object.keys(sitesConfig.sites).join(', ')}`);
  }

  return sitesConfig.sites[siteCode];
});

container.set('params.content_dir', (c) => {
  const { contentDir } = c.get('params.site_config');
  return path.normalize(path.join(process.cwd(), contentDir));
});

container.set('translator', (c) => {
  const { locale = 'en', translations = {} } = c.get<Site>('params.site_config');
  return new Translator(locale, translations);
});

container.set('content.repository', (c) => {
  const factory = new ContentRepositoryFactory(
    c.get<ContentLoader>('content.loader'),
    c.get<ContentProcessor>('content.processor'),
    c.get<RepositoryItemsProcessor[]>('content.repository.preprocessors'),
    c.get<RepositoryItemsProcessor[]>('content.repository.postprocessors'),
    c.get<RepositoryItemsGenerator[]>('content.repository.generators'),
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

container.set('content.repository_generator.taxonomy', (c) => new TaxonomyGenerator(
  c.get<ContentProcessor>('content.processor'),
));

container.set('content.repository_generator.listing', (c) => {
  const { taxonomyCollections, pagination } = c.get<Site>('params.site_config');

  if (!pagination) {
    return new NullGenerator();
  }

  return new ListingGenerator(pagination, taxonomyCollections ? Object.keys(taxonomyCollections) : []);
});

container.set('content.repository.generators', (c) => [
  c.get<TaxonomyGenerator>('content.repository_generator.taxonomy'),
  c.get<ListingGenerator>('content.repository_generator.listing'),
] as RepositoryItemsGenerator[]);

container.set(
  'content.repository_preprocessor.exclude_drafts',
  (c) => new ExcludeDraftsProcessor(c.get('params.app_env') !== 'dev'),
);

container.set('content.repository_preprocessor.sort', () => new SortPostprocessor());

container.set('content.repository.preprocessors', (c) => [
  c.get<ExcludeDraftsProcessor>('content.repository_preprocessor.exclude_drafts'),
] as RepositoryItemsProcessor[]);

container.set('content.repository.postprocessors', (c) => [
  c.get<SortPostprocessor>('content.repository_preprocessor.sort'),
] as RepositoryItemsProcessor[]);

container.set('content', (c) => {
  const { taxonomyCollections } = c.get<Site>('params.site_config');

  return new Content(
    c.get('content.repository'),
    c.get('content.related_content_generator'),
    taxonomyCollections ? Object.keys(taxonomyCollections) : [],
  );
});

container.set('content.related_content_generator', (c) => new RelatedContent(
  c.get<ContentRepository>('content.repository'),
  relatedContent,
));
