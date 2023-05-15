import ContentGenerator from '@/services/content/ContentGenerator';
import ContentLoader from '@/services/content/ContentLoader';
import ContentProcessor from '@/services/content/ContentProcessor';
import ContentRepository from '@/services/content/ContentRepository';
import { ContentItem } from '@/types/Content';

type ContentRepositoryFactoryOptions = {
  includeDrafts?: boolean,
};

export default class ContentRepositoryFactory {
  readonly #loader: ContentLoader;

  readonly #processor: ContentProcessor;

  readonly #generators: ContentGenerator[];

  readonly #options: ContentRepositoryFactoryOptions;

  constructor(
    loader: ContentLoader,
    processor: ContentProcessor,
    generators: ContentGenerator[],
    options: ContentRepositoryFactoryOptions,
  ) {
    this.#loader = loader;
    this.#processor = processor;
    this.#generators = generators;
    this.#options = options;
  }

  public createRepository(): ContentRepository {
    const loadedContent = this.#loader.loadContent();
    const items = this.filterOutDrafts(
      loadedContent.map((item) => this.#processor.process(item)),
    );

    const repository = new ContentRepository(items);

    this.#generators.forEach((generator) => {
      repository.add(...generator.generate(repository));
    });

    return repository;
  }

  private filterOutDrafts(items: ContentItem[]): ContentItem[] {
    if (this.#options.includeDrafts) {
      return items;
    }

    return items.filter((item) => !item.draft);
  }
}
