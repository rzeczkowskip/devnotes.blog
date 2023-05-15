import RepositoryItemsPreprocessor from '@/services/content/RepositoryItemsPreprocessor';
import { ContentItem } from '@/types/Content';

export default class ExcludeDraftsPreprocessor implements RepositoryItemsPreprocessor {
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
