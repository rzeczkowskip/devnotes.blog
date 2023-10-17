import path from 'path';
import matter from 'gray-matter';
import SlugGenerator from '@/services/content/SlugGenerator';
import { LoadedContent } from '@/services/content/types';
import { ContentItem } from '@/types/Content';

export default class ContentProcessor {
  readonly #taxonomyCollections: Record<string, string>;

  readonly #defaultCollection: string;

  readonly #slugGenerator: SlugGenerator;

  constructor(
    taxonomyCollections: Record<string, string>,
    defaultCollection: string,
    slugGenerator: SlugGenerator,
  ) {
    this.#taxonomyCollections = taxonomyCollections;
    this.#defaultCollection = defaultCollection;
    this.#slugGenerator = slugGenerator;
  }

  public process(item: LoadedContent): ContentItem {
    const { content: loadedContent, path: filePath } = item;
    const { content, data: metadata } = matter(loadedContent);

    const [baseUri, uri, assetsBaseUri] = this.buildUris(filePath);
    const title = metadata?.title || this.getTitleFromUri(uri);
    const taxonomies = this.getTaxonomyUrisFromMetadata(metadata);
    const collection =
      typeof metadata?.collection === 'string'
        ? metadata.collection
        : this.#defaultCollection;

    return {
      content,
      draft: metadata?.draft === true,
      collection,
      uri,
      canonicalUri:
        typeof metadata?.canonicalUrl === 'string'
          ? metadata?.canonicalUrl
          : uri,
      contentId: baseUri,
      assetsBaseUri,
      title,
      date:
        metadata?.date instanceof Date
          ? metadata.date.toISOString()
          : undefined,
      taxonomies,
      list: this.extractListingData(metadata),
      isPaginationPage: false,
      isTaxonomy: !!this.#taxonomyCollections[collection],
      metadata: this.extractAdditionalMetadata(metadata),
    };
  }

  private buildUris(filePath: string): [string, string, string] {
    const slug = this.#slugGenerator.slugify(filePath.replace(/\.md$/, ''));

    const assetBase = path.dirname(filePath);

    const deindexedSlug = slug.replace(/\/index$/, '');

    if (deindexedSlug === 'index') {
      return ['/', '/', '/'];
    }

    const uri = `/${deindexedSlug.replace(/^\//, '')}`;
    const baseUri = slug === deindexedSlug ? uri : `${uri}/`;

    return [baseUri, uri, assetBase];
  }

  private getTitleFromUri(uri: string): string {
    return uri.replace('/', '-').replace(/^\/|\/$/, '');
  }

  private getTaxonomyUrisFromMetadata(
    metadata: Record<string, unknown>,
  ): Record<string, Record<string, string>> {
    const entries = Object.entries(this.#taxonomyCollections).map(
      ([taxonomy, uriPrefix]) => {
        const taxonomyValuesIsArray = Array.isArray(metadata?.[taxonomy]);

        if (!taxonomyValuesIsArray) {
          return [taxonomy, []];
        }

        const rawValues: string[] = (metadata[taxonomy] as unknown[]).filter(
          (v) => typeof v === 'string',
        ) as string[];
        const values = rawValues.map((value) => [
          `${uriPrefix}/${this.#slugGenerator.slugify(value)}`,
          value,
        ]);

        return [taxonomy, Object.fromEntries(values)];
      },
    );

    return Object.fromEntries(entries);
  }

  private extractAdditionalMetadata(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: Record<string, any>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Record<string, any> {
    const filteredEntries = Object.entries(metadata).filter(
      ([key]) =>
        !(key in this.#taxonomyCollections) &&
        !['title', 'date', 'draft', 'collection', 'list'].includes(key),
    );

    return Object.fromEntries(filteredEntries);
  }

  private extractListingData(
    metadata: Record<string, unknown>,
  ): ContentItem['list'] {
    if (
      !('list' in metadata) ||
      typeof metadata.list !== 'object' ||
      !metadata.list
    ) {
      return undefined;
    }

    const metadataListConfig = metadata.list;

    if (
      !('collection' in metadataListConfig) ||
      typeof metadataListConfig.collection !== 'string'
    ) {
      return undefined;
    }

    const hasItemsPerPage =
      'itemsPerPage' in metadataListConfig &&
      Number.isSafeInteger(metadataListConfig.itemsPerPage);
    const itemsPerPage = hasItemsPerPage
      ? Math.abs(metadataListConfig.itemsPerPage as number)
      : undefined;

    return {
      collection: metadataListConfig.collection,
      isTaxonomyList:
        !!this.#taxonomyCollections[metadataListConfig.collection],
      itemsPerPage,
    };
  }
}
