import ContentProcessor from '@/services/content/ContentProcessor';
import ContentRepository from '@/services/content/ContentRepository';
import RepositoryItemsGenerator from '@/services/content/RepositoryItemsGenerator';
import { ContentItem } from '@/types/Content';

export default class TaxonomyGenerator implements RepositoryItemsGenerator {
  readonly #contentProcessor: ContentProcessor;

  constructor(contentProcessor: ContentProcessor) {
    this.#contentProcessor = contentProcessor;
  }

  public generate(repository: ContentRepository): ContentItem[] {
    const taxonomies: ContentItem[] = [];

    repository.items.forEach((item) => {
      taxonomies.push(...this.getMissingTaxonomiesFromItem(item, repository));
    });

    return taxonomies;
  }

  private getMissingTaxonomiesFromItem(item: ContentItem, repository: ContentRepository): ContentItem[] {
    const taxonomies: ContentItem[] = [];

    Object.entries(item.taxonomies).forEach(([collection, values]) => {
      const missingValues = this.filterOutExistingTaxonomies(values, repository);
      const missingContentItems = Object.entries(missingValues)
        .map(([uri, title]) => this.createTaxonomyContentItem(uri, title, collection));

      taxonomies.push(...missingContentItems);
    });

    return taxonomies;
  }

  private filterOutExistingTaxonomies(
    values: Record<string, string>,
    repository: ContentRepository,
  ): Record<string, string> {
    const filteredEntries = Object.entries(values).filter(([uri]) => !repository.has(uri));

    return Object.fromEntries(filteredEntries);
  }

  private createTaxonomyContentItem(path: string, title: string, collection: string): ContentItem {
    return this.#contentProcessor.process({
      path,
      content: `---
collection: ${collection}
title: ${title}
---`,
    });
  }
}
