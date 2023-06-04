export type NavLink = {
  url: string,
  label: string,
  newWindow?: boolean,
};

export type Pagination = {
  pageUrlPart: string,
  itemsPerPage: number,
};

export type Site = {
  title: string,
  baseUrl: string,
  contentDir: string,
  locale?: string,
  translations?: Record<string, string>,
  nav?: NavLink[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>,
  taxonomyCollections?: Record<string, string>,
  pagination?: Pagination,
};

export type SiteConfig = {
  sites: Record<'default' | string, Site>
};
