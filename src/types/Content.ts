export type ContentItem = {
  collection: string,
  uri: string,
  baseUri: string,
  title: string,
  content: string,
  date?: string,
  taxonomies: Record<string, string[]>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: Record<string, any>,
  draft: boolean,
};
