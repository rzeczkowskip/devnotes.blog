import ContentGenerator from '@/services/content/ContentGenerator';
import ContentRepository from '@/services/content/ContentRepository';
import { ContentItem } from '@/types/Content';
import { Pagination } from '@/types/SiteConfig';

export default class ListingGenerator implements ContentGenerator {
  readonly #config: Pagination;

  readonly #taxonomies: string[];

  constructor(
    config: Pagination,
    taxonomies: string[],
  ) {
    this.#config = config;
    this.#taxonomies = taxonomies;
  }

  public generate(repository: ContentRepository): ContentItem[] {
    const listingItems: ContentItem[] = [];

    repository.items.forEach((item) => {
      if (!item?.list) {
        return;
      }

      const itemsPerPage = item.list.itemsPerPage === undefined
        ? this.#config.itemsPerPage
        : item.list.itemsPerPage;

      const isTaxonomy = this.#taxonomies.includes(item.collection);

      const pageCount = this.getPageCount(
        repository,
        item.list.collection,
        itemsPerPage,
        isTaxonomy ? [item.collection, item.uri] : undefined,
      );

      for (let i = 1; i <= pageCount; i += 1) {
        const uri = this.getPageUrl(item.uri, i);

        listingItems.push({
          ...item,
          uri,
          metadata: {
            canonicalUri: uri,
            ...item.metadata,
          },
          pagination: {
            ...item.list,
            page: i,
            totalPages: pageCount,
            hasNext: i < pageCount,
            hasPrevious: i > 1,
          },
        } as ContentItem);
      }

      listingItems.push({
        ...item,
        metadata: {
          canonicalUri: this.getPageUrl(item.uri, 1),
          ...item.metadata,
        },
        pagination: {
          ...item.list,
          page: 1,
          totalPages: pageCount,
          hasNext: pageCount > 1,
          hasPrevious: false,
        },
      });
    });

    return listingItems;
  }

  private getPageCount(
    repository: ContentRepository,
    collection: string,
    itemsPerPage: number,
    taxonomyFilter?: [string, string],
  ): number {
    const items = repository.findCollectionItems(collection, taxonomyFilter);

    if (itemsPerPage === 0) {
      return 1;
    }

    const pages = Math.ceil(items.length / itemsPerPage);

    return pages > 0 ? pages : 1;
  }

  private getPageUrl(prefix: string, page: number): string {
    return `${prefix}/${this.#config.pageUrlPart}/${page}`.replace(/\/{2,}/, '/');
  }
}
