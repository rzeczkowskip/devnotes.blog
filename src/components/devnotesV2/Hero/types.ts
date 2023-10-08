import { TaxonomyRelation } from '@/types/Content';

export type HeroDetailsProps = {
  date?: string;
  links?: TaxonomyRelation[];
};

export type HeroProps = HeroDetailsProps & {
  title: string;
  subtitle?: string;
};
