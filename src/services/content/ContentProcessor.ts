import { meta } from '@typescript-eslint/parser';
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
    const { content: loadedContent, path } = item;
    const { content, data: metadata } = matter(loadedContent);

    const [uri, baseUri] = this.buildUris(path);
    const title = metadata?.title || this.getTitleFromUri(uri);
    const taxonomies = this.getTaxonomyUrisFromMetadata(metadata);

    return {
      content,
      draft: metadata?.draft === true,
      collection: typeof metadata?.collection === 'string' ? metadata.collection : this.#defaultCollection,
      uri,
      baseUri,
      title,
      date: metadata?.date instanceof Date ? metadata.date.toISOString() : undefined,
      taxonomies,
      metadata: this.extractAdditionalMetadata(metadata),
    };
  }

  private buildUris(path: string): [string, string] {
    const slug = this.#slugGenerator.slugify(
      path.replace(/\.md$/, ''),
    );

    const deindexedSlug = slug.replace(/\/index$/, '');

    if (deindexedSlug === 'index') {
      return ['/', '/'];
    }

    const uri = `/${deindexedSlug.replace(/^\//, '')}`;
    const baseUri = slug === deindexedSlug ? uri : `${uri}/`;

    return [uri, baseUri];
  }

  private getTitleFromUri(uri: string): string {
    return uri
      .replace('/', '-')
      .replace(/^\/|\/$/, '');
  }

  private getTaxonomyUrisFromMetadata(metadata: Record<string, unknown>): Record<string, string[]> {
    const entries = Object.entries(this.#taxonomyCollections).map(([taxonomy, uriPrefix]) => {
      const taxonomyValuesIsArray = Array.isArray(metadata?.[taxonomy]);

      if (!taxonomyValuesIsArray) {
        return [taxonomy, []];
      }

      const rawValues: string[] = (metadata[taxonomy] as unknown[]).filter((v) => typeof v === 'string') as string[];
      const uriValues = rawValues.map((value) => `${uriPrefix}/${value}`);

      return [taxonomy, uriValues];
    });

    return Object.fromEntries(entries);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractAdditionalMetadata(metadata: Record<string, any>): Record<string, any> {
    const filteredEntries = Object.entries(metadata)
      .filter(([key]) => key in this.#taxonomyCollections || key in ['title', 'date', 'draft', 'collection']);

    return Object.fromEntries(filteredEntries);
  }
}
