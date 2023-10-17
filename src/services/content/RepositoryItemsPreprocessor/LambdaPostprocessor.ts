import RepositoryItemsProcessor from '@/services/content/RepositoryItemsProcessor';
import { ContentItem } from '@/types/Content';

type PostprocessorCallback = (item: ContentItem) => ContentItem;

export default class LambdaPostprocessor implements RepositoryItemsProcessor {
  readonly #callback: PostprocessorCallback;

  constructor(callback: PostprocessorCallback) {
    this.#callback = callback;
  }

  public preprocess(items: ContentItem[]): ContentItem[] {
    return items.map(this.#callback);
  }
}
