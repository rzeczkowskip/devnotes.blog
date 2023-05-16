import RepositoryItemsProcessor from '@/services/content/RepositoryItemsProcessor';
import { ContentItem } from '@/types/Content';

export default class ExcludeDraftsProcessor implements RepositoryItemsProcessor {
  readonly #excludeDrafts: boolean;

  constructor(excludeDrafts: boolean) {
    this.#excludeDrafts = excludeDrafts;
  }

  public preprocess(items: ContentItem[]): ContentItem[] {
    if (!this.#excludeDrafts) {
      return items;
    }

    return items.filter((item) => !item.draft);
  }
}
