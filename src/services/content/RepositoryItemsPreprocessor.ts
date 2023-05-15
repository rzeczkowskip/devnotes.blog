import { ContentItem } from '@/types/Content';

export default interface RepositoryItemsPreprocessor {
  preprocess(items: ContentItem[]): ContentItem[];
}
