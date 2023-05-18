import { RelatedContentConfig } from '@/services/content/types';

export default {
  collections: ['posts'],
  taxonomyScores: {
    categories: 80,
    tags: 80,
  },
} as RelatedContentConfig;
