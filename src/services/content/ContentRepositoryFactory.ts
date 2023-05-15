import ContentLoader from '@/services/content/ContentLoader';
import ContentProcessor from '@/services/content/ContentProcessor';
import ContentRepository from '@/services/content/ContentRepository';
import RepositoryItemsGenerator from '@/services/content/RepositoryItemsGenerator';
import RepositoryItemsPreprocessor from '@/services/content/RepositoryItemsPreprocessor';

export default class ContentRepositoryFactory {
  readonly #loader: ContentLoader;

  readonly #contentProcessor: ContentProcessor;

  readonly #preprocessors: RepositoryItemsPreprocessor[];

  readonly #generators: RepositoryItemsGenerator[];

  constructor(
    loader: ContentLoader,
    contentProcessor: ContentProcessor,
    preprocessors: RepositoryItemsPreprocessor[],
    generators: RepositoryItemsGenerator[],
  ) {
    this.#loader = loader;
    this.#contentProcessor = contentProcessor;
    this.#preprocessors = preprocessors;
    this.#generators = generators;
  }

  public createRepository(): ContentRepository {
    const loadedContent = this.#loader.loadContent();
    const items = loadedContent.map((item) => this.#contentProcessor.process(item));

    const preprocessedItems = this.#preprocessors
      .reduce((previous, preprocessor) => preprocessor.preprocess(previous), items);

    const repository = new ContentRepository(preprocessedItems);

    this.#generators.forEach((generator) => {
      repository.add(...generator.generate(repository));
    });

    return repository;
  }
}
