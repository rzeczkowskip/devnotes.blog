import ContentRepository from '@/services/content/ContentRepository';
import { ContentItem, TaxonomyRelation } from '@/types/Content';

type Page = {
  contentItem: ContentItem,
  taxonomies: TaxonomyRelation[],
  listItems: Page[],
};

export default class Content {
  readonly #repository: ContentRepository;

  readonly #taxonomyCollections: string[];

  readonly #cache: Record<string, Page> = {};

  constructor(repository: ContentRepository, taxonomyCollections: string[]) {
    this.#repository = repository;
    this.#taxonomyCollections = taxonomyCollections;
  }

  public getPage(uri: string | string[]): Page {
    const uriString = (Array.isArray(uri) ? `/${uri.join('/')}` : uri);
    const itemUri = `/${uriString.replace(/^\/|\/$/, '')}`;

    if (!this.#cache?.[itemUri]) {
      const item = this.#repository.get(itemUri);
      const listItems = this.getListItems(item);

      this.#cache[itemUri] = {
        contentItem: item,
        listItems,
        taxonomies: [],
      };
    }

    return this.#cache[itemUri];
  }

  private getListItems(item: ContentItem): Page[] {
    if (!item.pagination) {
      return [];
    }

    const isTaxonomy = this.#taxonomyCollections.includes(item.collection);
    const taxonomyFilter: [string, string] | undefined = isTaxonomy ? [item.collection, item.uri] : undefined;

    const items = this.#repository.findCollectionPageItems(
      item.pagination.collection,
      item.pagination.page,
      item.pagination.itemsPerPage || 0,
      taxonomyFilter,
    );

    return items.map((v) => this.getPage(v));
  }
}
