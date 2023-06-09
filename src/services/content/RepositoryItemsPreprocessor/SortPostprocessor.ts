import RepositoryItemsProcessor from '@/services/content/RepositoryItemsProcessor';
import { ContentItem } from '@/types/Content';

export default class SortPostprocessor implements RepositoryItemsProcessor {
  public preprocess(items: ContentItem[]): ContentItem[] {
    const itemsCopy = [...items];

    itemsCopy.sort((a, b) => {
      if (a.draft !== b.draft) {
        return (b.draft ? 1 : 0) - (a.draft ? 1 : 0);
      }

      const dateDiff = this.getItemTime(b) - this.getItemTime(a);

      if (dateDiff !== 0) {
        return dateDiff;
      }

      return a.title.localeCompare(b.title);
    });

    return itemsCopy;
  }

  public getItemTime(item: ContentItem): number {
    if (item.date === undefined) {
      return item.draft ? Number.MAX_VALUE : 0;
    }

    return new Date(item.date as string).getTime();
  }
}
