import ContentLoader from '@/services/content/ContentLoader';
import ContentProcessor from '@/services/content/ContentProcessor';
import ContentRepository from '@/services/content/ContentRepository';
import TaxonomyGenerator from '@/services/content/TaxonomyGenerator';

export default class ContentRepositoryFactory {
  readonly #loader: ContentLoader;

  readonly #processor: ContentProcessor;

  readonly #taxonomyGenerator: TaxonomyGenerator;

  constructor(loader: ContentLoader, processor: ContentProcessor, taxonomyGenerator: TaxonomyGenerator) {
    this.#loader = loader;
    this.#processor = processor;
    this.#taxonomyGenerator = taxonomyGenerator;
  }

  public createRepository(): ContentRepository {
    const loadedContent = this.#loader.loadContent();
    const items = loadedContent.map((item) => this.#processor.process(item));

    const repository = new ContentRepository(items);

    repository.add(...this.#taxonomyGenerator.generateMissingTaxonomies(repository));

    return repository;
  }
}
