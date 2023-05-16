import ContentRepository from '@/services/content/ContentRepository';
import { ContentItem, Page, TaxonomyRelation } from '@/types/Content';

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
      const taxonomies = this.getTaxonomyRelations(item);

      this.#cache[itemUri] = {
        contentItem: item,
        listItems,
        taxonomies,
      };
    }

    return this.#cache[itemUri];
  }

  private getListItems(root: ContentItem): Page[] {
    if (!root.pagination) {
      return [];
    }

    const isTaxonomy = this.#taxonomyCollections.includes(root.collection);
    const taxonomyFilter: [string, string] | undefined = isTaxonomy ? [root.collection, root.uri] : undefined;

    const items = this.#repository.findCollectionPageItems(
      root.pagination.collection,
      root.pagination.page,
      root.pagination.itemsPerPage || 0,
      taxonomyFilter,
    );

    return items
      .map((item) => this.getPage(item))
      .filter((item) => item.contentItem.canonicalUri === item.contentItem.uri);
  }

  private getTaxonomyRelations(root: ContentItem): Record<string, TaxonomyRelation[]> {
    const entries = this.#taxonomyCollections.map((collection) => {
      const links = Object.keys(root.taxonomies?.[collection] || {});
      const relations: TaxonomyRelation[] = links.map((link) => {
        const taxonomy = this.#repository.get(link);

        return {
          date: taxonomy.date,
          metadata: taxonomy.metadata,
          title: taxonomy.title,
          uri: taxonomy.uri,
          collection: taxonomy.collection,
        };
      });

      return [collection, relations];
    });

    return Object.fromEntries(entries);
  }
}
