export type ContentItem = {
  collection: string,
  uri: string,
  baseUri: string,
  canonicalUri: string,
  title: string,
  content: string,
  date?: string,
  taxonomies: Record<string, Record<string, string>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>,
  draft: boolean,
  list?: {
    collection: string,
    itemsPerPage?: number,
  },
  pagination?: NonNullable<ContentItem['list']> & {
    page: number,
    totalPages: number,
    hasNext: boolean,
    hasPrevious: boolean,
  }
};

export type TaxonomyRelation = Pick<ContentItem, 'collection' | 'uri' | 'title' | 'date' | 'metadata'>;

export type Page = {
  contentItem: ContentItem,
  taxonomies: Record<string, TaxonomyRelation[]>,
  listItems: Page[],
};
