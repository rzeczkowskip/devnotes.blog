export type NavLink = {
  url: string,
  label: string,
  newWindow?: boolean,
};

export type Site = {
  title: string,
  contentPath?: string,
  locale: string,
  nav?: NavLink[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>,
  routingPrefixes?: Record<string, string>,
};
