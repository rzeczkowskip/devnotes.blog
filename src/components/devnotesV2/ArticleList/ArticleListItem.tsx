import React from 'react';
import HeroTitle, {
  HeroTitleSize,
} from '@/components/devnotesV2/HeroTitle/HeroTitle';
import { ContentItem } from '@/types/Content';

type ArticleListItemProps = {
  item: ContentItem;
};
const ArticleListItem: React.FC<ArticleListItemProps> = ({ item }) => {
  const {
    uri,
    title,
    date,
    metadata: { summary },
  } = item;

  return (
    <article className="max-w-full mb-6 pb-6 border-b border-b-slate-300 last:border-0 last:mb-0 last:pb-0">
      <HeroTitle
        title={title}
        href={uri}
        date={date}
        size={HeroTitleSize.Small}
      />

      {summary && <p className="mb-0">{summary}</p>}
    </article>
  );
};

export default ArticleListItem;
