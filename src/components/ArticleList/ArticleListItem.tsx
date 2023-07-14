import Link from 'next/link';
import React from 'react';
import ArticleDate from '@/components/ArticleDate';
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
    <article className="mb-8 pb-8 border-b border-b-slate-300 last:border-0 last:mb-0 last:pb-0">
      <h2 className="my-0 h1">
        <Link
          href={uri}
          title={title}
          className="content-link-reverse font-extrabold no-underline"
        >
          {title}
        </Link>
      </h2>

      {date && <ArticleDate className="text-xs font-normal" date={date} />}

      {summary && <p className="mb-0">{summary}</p>}
    </article>
  );
};

export default ArticleListItem;
