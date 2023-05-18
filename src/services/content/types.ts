export type LoadedContent = {
  content: string,
  path: string,
};

export type RelatedContentConfig = {
  collections: string[],
  taxonomyScores: Record<string, number>,
};
