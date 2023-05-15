import ContentRepository from '@/services/content/ContentRepository';
import { ContentItem } from '@/types/Content';

export default interface ContentGenerator {
  generate(repository: ContentRepository): ContentItem[];
}
