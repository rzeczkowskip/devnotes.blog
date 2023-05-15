import ContentRepository from '@/services/content/ContentRepository';
import { ContentItem } from '@/types/Content';

export default interface RepositoryItemsGenerator {
  generate(repository: ContentRepository): ContentItem[];
}
