import React from 'react';
import ArticleListItem from '@/components/devnotesV2/ArticleList/ArticleListItem';
import Pagination from '@/components/devnotesV2/Pagination';
import Prose from '@/components/devnotesV2/Prose';
import ProseContainer from '@/components/devnotesV2/ProseContainer';
import { ListItem, Pagination as ContentPagination } from '@/types/Content';

type ArticleListProps = {
  items: ListItem[];
  pagination?: ContentPagination;
};

const ArticleList: React.FC<ArticleListProps> = ({ items, pagination }) => (
  <>
    <Prose as={'div'} className="content-links-reverse">
      {items.map((item) => (
        <ArticleListItem
          item={item.contentItem}
          key={`${item.contentItem.uri}`}
        />
      ))}
    </Prose>

    {(pagination?.hasNext || pagination?.hasPrevious) && (
      <Pagination {...pagination} className="mt-20" />
    )}
  </>
);

export default ArticleList;
