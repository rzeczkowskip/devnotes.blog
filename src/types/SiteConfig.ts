export type NavLink = {
  url: string,
  label: string,
  newWindow?: boolean,
};

export type Site = {
  title: string,
  contentDir?: string,
  nav?: NavLink[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>,
  taxonomyCollections?: Record<string, string>,
};

export type SiteConfig = {
  sites: Record<'default' | string, Site>
};
