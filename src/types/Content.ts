export type ContentItem = {
  collection: string;
  uri: string;
  contentId: string;
  assetsBaseUri: string;
  canonicalUri: string;
  title: string;
  content: string;
  date?: string;
  taxonomies: Record<string, Record<string, string>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>;
  draft: boolean;
  list?: {
    collection: string;
    isTaxonomyList: boolean;
    itemsPerPage?: number;
  };
  isPaginationPage: boolean;
  pagination?: NonNullable<ContentItem['list']> & {
    page: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    links: {
      next?: string;
      previous?: string;
    };
  };
};

export type Pagination = NonNullable<ContentItem['pagination']>;

export type TaxonomyRelation = Pick<
  ContentItem,
  'collection' | 'uri' | 'title' | 'date' | 'metadata'
>;

export type Page = {
  contentItem: ContentItem;
  taxonomies: Record<string, TaxonomyRelation[]>;
  listItems: ListItem[];
  relatedItems: ListItem[];
};

export type ListItem = Pick<Page, 'contentItem' | 'taxonomies'>;
