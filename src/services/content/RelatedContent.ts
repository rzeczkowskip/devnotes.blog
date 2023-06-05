import ContentRepository from '@/services/content/ContentRepository';
import { RelatedContentConfig } from '@/services/content/types';
import { ContentItem } from '@/types/Content';

type ScoredItem = {
  score: number,
  item: ContentItem,
};

export default class RelatedContent {
  readonly #repository: ContentRepository;

  readonly #config: RelatedContentConfig;

  constructor(
    repository: ContentRepository,
    config: RelatedContentConfig,
  ) {
    this.#repository = repository;
    this.#config = config;
  }

  public findRelatedItems(item: ContentItem, count = 3): ContentItem[] {
    if (!this.#config.collections.includes(item.collection)) {
      return [];
    }

    const valuesToMatch: Record<string, string[]> = this.extractValuesToMatch(item.taxonomies);
    const candidates = this.#repository.items
      .filter((candidate) => candidate !== item && !candidate.isPaginationPage);

    const scores: ScoredItem[] = this.scoreItems(
      valuesToMatch,
      candidates,
    );

    scores.sort((a, b) => b.score - a.score);

    return scores
      .filter(({ score, item: scoredItem }) => score > 0 || scoredItem.collection === item.collection)
      .slice(0, count)
      .map((score) => score.item);
  }

  private extractValuesToMatch(itemTaxonomies: ContentItem['taxonomies']): Record<string, string[]> {
    const valuesToMatch = Object.keys((this.#config.taxonomyScores))
      .map((taxonomy): [string, string[]] => {
        const values = Object.keys(itemTaxonomies[taxonomy] || {});

        return [taxonomy, values];
      })
      .filter(([, values]) => values.length > 0);

    return Object.fromEntries(valuesToMatch);
  }

  private scoreItems(valuesToMatch: Record<string, string[]>, items: ContentItem[]): ScoredItem[] {
    return items.map((item) => {
      const scores = Object.entries(valuesToMatch)
        .map(([taxonomy, values]) => this.getTaxonomyScore(
          this.#config.taxonomyScores[taxonomy],
          values,
          Object.keys(item.taxonomies?.[taxonomy]),
        ));

      const score = scores.reduce((previous, current) => previous + current, 0);

      return { score, item };
    });
  }

  private getTaxonomyScore(weight: number, valuesToMatch: string[], itemValues?: string[]): number {
    if (!itemValues || itemValues.length === 0) {
      return 0;
    }

    const matchCount = itemValues.filter((value) => valuesToMatch.includes(value)).length;

    return matchCount * weight;
  }
}
