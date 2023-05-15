import RepositoryItemsGenerator from '@/services/content/RepositoryItemsGenerator';
import { ContentItem } from '@/types/Content';

export default class NullGenerator implements RepositoryItemsGenerator {
  public generate(): ContentItem[] {
    return [];
  }
}
