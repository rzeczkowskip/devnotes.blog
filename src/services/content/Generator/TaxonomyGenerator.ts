import ContentGenerator from '@/services/content/ContentGenerator';
import ContentProcessor from '@/services/content/ContentProcessor';
import ContentRepository from '@/services/content/ContentRepository';
import { ContentItem } from '@/types/Content';

export default class TaxonomyGenerator implements ContentGenerator {
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
      const missingContentItems = missingValues.map((value) => this.createTaxonomyContentItem(value, collection));

      taxonomies.push(...missingContentItems);
    });

    return taxonomies;
  }

  private filterOutExistingTaxonomies(values: string[], repository: ContentRepository): string[] {
    return values.filter((value) => !repository.has(value));
  }

  private createTaxonomyContentItem(path: string, collection: string): ContentItem {
    const title = path.split('/').pop() || '';

    return this.#contentProcessor.process({
      path,
      content: `---
collection: ${collection}
title: ${title}
list:
  collection: posts
---`,
    });
  }
}
