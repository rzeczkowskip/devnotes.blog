import { Page, TaxonomyRelation } from '@/types/Content';

type Taxonomies = Page['taxonomies'];

const useTaxonomies = (taxonomies: Taxonomies) => {
  const hasTaxonomies = (taxonomyCollection?: string) =>
    Object.entries(taxonomies).some(([taxonomy, items]) => {
      if (taxonomyCollection && taxonomyCollection !== taxonomy) {
        return false;
      }

      return items.length > 0;
    });

  const getTaxonomies = (taxonomyCollection: string): TaxonomyRelation[] =>
    taxonomies[taxonomyCollection] || [];

  return {
    hasTaxonomies,
    getTaxonomies,
  };
};

export default useTaxonomies;
