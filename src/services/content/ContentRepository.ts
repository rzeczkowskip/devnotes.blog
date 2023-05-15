import { ContentItem } from '@/types/Content';

export default class ContentRepository {
  readonly #items: Record<string, ContentItem>;

  constructor(items: ContentItem[]) {
    this.#items = Object.fromEntries(items.map((item) => [item.uri, item]));
  }

  get items(): Record<string, ContentItem> {
    return this.#items;
  }

  public has(uri: string): boolean {
    return this.#items?.[uri] !== undefined;
  }

  public add(...items: ContentItem[]): void {
    items.forEach((item) => {
      this.#items[item.uri] = item;
    });
  }
}
