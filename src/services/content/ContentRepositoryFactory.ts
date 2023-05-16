import ContentLoader from '@/services/content/ContentLoader';
import ContentProcessor from '@/services/content/ContentProcessor';
import ContentRepository from '@/services/content/ContentRepository';
import RepositoryItemsGenerator from '@/services/content/RepositoryItemsGenerator';
import RepositoryItemsProcessor from '@/services/content/RepositoryItemsProcessor';
import { ContentItem } from '@/types/Content';

export default class ContentRepositoryFactory {
  readonly #loader: ContentLoader;

  readonly #contentProcessor: ContentProcessor;

  readonly #preprocessors: RepositoryItemsProcessor[];

  readonly #postprocessors: RepositoryItemsProcessor[];

  readonly #generators: RepositoryItemsGenerator[];

  constructor(
    loader: ContentLoader,
    contentProcessor: ContentProcessor,
    preprocessors: RepositoryItemsProcessor[],
    postprocessors: RepositoryItemsProcessor[],
    generators: RepositoryItemsGenerator[],
  ) {
    this.#loader = loader;
    this.#contentProcessor = contentProcessor;
    this.#preprocessors = preprocessors;
    this.#postprocessors = postprocessors;
    this.#generators = generators;
  }

  public createRepository(): ContentRepository {
    const loadedContent = this.#loader.loadContent();
    const items = loadedContent.map((item) => this.#contentProcessor.process(item));

    const preprocessedItems = this.applyProcessors(this.#preprocessors, items);

    const tempRepository = new ContentRepository(preprocessedItems);

    this.#generators.forEach((generator) => {
      tempRepository.add(...generator.generate(tempRepository));
    });

    const postprocessedItems = this.applyProcessors(this.#postprocessors, tempRepository.items);

    return new ContentRepository(postprocessedItems);
  }

  private applyProcessors(processors: RepositoryItemsProcessor[], initialItems: ContentItem[]): ContentItem[] {
    return processors.reduce(
      (previous, preprocessor) => preprocessor.preprocess(previous),
      initialItems,
    );
  }
}
