import { ContentItem } from '@/types/Content';

export default interface RepositoryItemsProcessor {
  preprocess(items: ContentItem[]): ContentItem[];
}
