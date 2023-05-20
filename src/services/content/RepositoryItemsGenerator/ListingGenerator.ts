import ContentRepository from '@/services/content/ContentRepository';
import RepositoryItemsGenerator from '@/services/content/RepositoryItemsGenerator';
import { ContentItem } from '@/types/Content';
import { Pagination } from '@/types/SiteConfig';

export default class ListingGenerator implements RepositoryItemsGenerator {
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
      const isTaxonomy = this.#taxonomies.includes(item.collection);

      if (!isTaxonomy && !item?.list) {
        return;
      }

      const listConfig = {
        collection: 'posts',
        ...(item.list || {}),
      };

      const itemsPerPage = listConfig.itemsPerPage === undefined
        ? this.#config.itemsPerPage
        : listConfig.itemsPerPage;

      const pageCount = this.getPageCount(
        repository,
        listConfig.collection,
        itemsPerPage,
        isTaxonomy ? [item.collection, item.uri] : undefined,
      );

      if (itemsPerPage !== 0) {
        for (let i = 1; i <= pageCount; i += 1) {
          const uri = this.getPageUrl(item.uri, i);

          const hasNext = i < pageCount;
          const hasPrevious = i > 1;

          listingItems.push({
            ...item,
            uri,
            canonicalUri: i === 1 ? item.uri : uri,
            isPaginationPage: true,
            pagination: {
              ...listConfig,
              itemsPerPage,
              page: i,
              totalPages: pageCount,
              hasNext,
              hasPrevious,
              links: {
                next: hasNext ? this.getPageUrl(item.uri, i + 1) : undefined,
                previous: hasPrevious ? this.getPageUrl(item.uri, i - 1) : undefined,
              },
            },
          } as ContentItem);
        }
      }

      listingItems.push({
        ...item,
        pagination: {
          ...listConfig,
          itemsPerPage,
          page: 1,
          totalPages: pageCount,
          hasNext: pageCount > 1,
          hasPrevious: false,
          links: {
            next: pageCount > 1 ? this.getPageUrl(item.uri, 2) : undefined,
          },
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
