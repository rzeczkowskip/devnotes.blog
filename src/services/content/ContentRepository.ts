import { ContentItem } from '@/types/Content';

export default class ContentRepository {
  readonly #items: Record<string, ContentItem>;

  constructor(items: ContentItem[]) {
    this.#items = Object.fromEntries(items.map((item) => [item.uri, item]));
  }

  get items(): ContentItem[] {
    return Object.values(this.#items);
  }

  get uris(): string[] {
    return Object.keys(this.#items);
  }

  public has(uri: string): boolean {
    return this.#items?.[uri] !== undefined;
  }

  public get(uri: string): ContentItem {
    const item = this.#items?.[uri];

    if (!item) {
      throw new Error(`Item ${uri} not found.`);
    }

    return item;
  }

  public add(...items: ContentItem[]): void {
    items.forEach((item) => {
      this.#items[item.uri] = item;
    });
  }

  public findCollectionItems(collection: string, taxonomyFilter?: [string, string]): ContentItem[] {
    return Object.values(this.items).filter((item) => {
      if (item.collection !== collection) {
        return false;
      }

      if (!taxonomyFilter) {
        return true;
      }

      const [taxonomy, value] = taxonomyFilter;
      return (item.taxonomies?.[taxonomy] || []).includes(value);
    });
  }
}
