import ContentRepository from '@/services/content/ContentRepository';
import {
  ContentItem, ListItem, Page, TaxonomyRelation,
} from '@/types/Content';

type Cache = {
  contentItem: Record<string, ContentItem>,
  listItems: Record<string, ListItem[]>,
  taxonomies: Record<string, Record<string, TaxonomyRelation[]>>
};

export default class Content {
  readonly #repository: ContentRepository;

  readonly #taxonomyCollections: string[];

  readonly #cache: Cache = {
    contentItem: {},
    listItems: {},
    taxonomies: {},
  };

  constructor(repository: ContentRepository, taxonomyCollections: string[]) {
    this.#repository = repository;
    this.#taxonomyCollections = taxonomyCollections;
  }

  public getPage(uri: string | string[]): Page {
    const uriString = (Array.isArray(uri) ? `/${uri.join('/')}` : uri);
    const itemUri = `/${uriString.replace(/^\/|\/$/, '')}`;

    const contentItem = this.getContentItem(itemUri);
    const taxonomies = this.getTaxonomyRelations(contentItem);
    const listItems = this.getListItems(contentItem);

    return {
      contentItem,
      taxonomies,
      listItems,
    };
  }

  public getPageWithFallback(uri: string | string[], fallback: Page): Page {
    try {
      return this.getPage(uri);
    } catch (e) {
      if (e instanceof Error && e.message.endsWith(' not found.')) {
        return fallback;
      }

      throw e;
    }
  }

  public getDummyPage(collection: string, title: string, uri: string, other?: Partial<ContentItem>): Page {
    return {
      contentItem: {
        isPaginationPage: false,
        title,
        uri,
        canonicalUri: uri,
        baseUri: uri,
        collection,
        content: '',
        draft: false,
        ...(other || {}),
        taxonomies: other?.taxonomies || {},
        metadata: other?.metadata || {},
      },
      listItems: [],
      taxonomies: {},
    };
  }

  private getContentItem(path: string): ContentItem {
    return this.#repository.get(path);
  }

  private getTaxonomyRelations(root: ContentItem): Record<string, TaxonomyRelation[]> {
    if (!this.#cache.taxonomies?.[root.canonicalUri]) {
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

      this.#cache.taxonomies[root.canonicalUri] = Object.fromEntries(entries);
    }

    return this.#cache.taxonomies[root.canonicalUri];
  }

  private getListItems(root: ContentItem): ListItem[] {
    if (!this.#cache.listItems?.[root.canonicalUri]) {
      if (!root.pagination) {
        this.#cache.listItems[root.canonicalUri] = [];
        return [];
      }

      const isTaxonomy = this.#taxonomyCollections.includes(root.collection);
      const taxonomyFilter: [string, string] | undefined = isTaxonomy
        ? [root.collection, root.baseUri]
        : undefined;

      const paths = this.#repository.findCollectionPageItems(
        root.pagination.collection,
        root.pagination.page,
        root.pagination.itemsPerPage || 0,
        taxonomyFilter,
      );

      this.#cache.listItems[root.canonicalUri] = paths
        .map((path) => {
          const contentItem = this.getContentItem(path);

          return {
            contentItem,
            taxonomies: this.getTaxonomyRelations(contentItem),
          };
        })
        .filter((item) => !item.contentItem.isPaginationPage);
    }

    return this.#cache.listItems[root.canonicalUri];
  }
}
