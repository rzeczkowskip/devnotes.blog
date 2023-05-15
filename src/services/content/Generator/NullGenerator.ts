import ContentGenerator from '@/services/content/ContentGenerator';
import { ContentItem } from '@/types/Content';

export default class NullGenerator implements ContentGenerator {
  public generate(): ContentItem[] {
    return [];
  }
}
