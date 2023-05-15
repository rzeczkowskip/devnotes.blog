import ContentLoader from '@/services/content/ContentLoader';
import ContentProcessor from '@/services/content/ContentProcessor';
import ContentRepository from '@/services/content/ContentRepository';
import TaxonomyGenerator from '@/services/content/TaxonomyGenerator';
import { ContentItem } from '@/types/Content';

type ContentRepositoryFactoryOptions = {
  includeDrafts?: boolean,
};

export default class ContentRepositoryFactory {
  readonly #loader: ContentLoader;

  readonly #processor: ContentProcessor;

  readonly #taxonomyGenerator: TaxonomyGenerator;

  readonly #options: ContentRepositoryFactoryOptions;

  constructor(
    loader: ContentLoader,
    processor: ContentProcessor,
    taxonomyGenerator: TaxonomyGenerator,
    options: ContentRepositoryFactoryOptions,
  ) {
    this.#loader = loader;
    this.#processor = processor;
    this.#taxonomyGenerator = taxonomyGenerator;
    this.#options = options;
  }

  public createRepository(): ContentRepository {
    const loadedContent = this.#loader.loadContent();
    const items = this.filterOutDrafts(
      loadedContent.map((item) => this.#processor.process(item)),
    );

    const repository = new ContentRepository(items);

    repository.add(...this.#taxonomyGenerator.generateMissingTaxonomies(repository));

    return repository;
  }

  private filterOutDrafts(items: ContentItem[]): ContentItem[] {
    if (this.#options.includeDrafts) {
      return items;
    }

    return items.filter((item) => !item.draft);
  }
}
