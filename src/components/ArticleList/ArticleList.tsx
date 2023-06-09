import React from 'react';
import ArticleListItem from '@/components/ArticleList/ArticleListItem';
import Pagination from '@/components/Pagination';
import Prose from '@/components/Prose';
import ProseContainer from '@/components/ProseContainer';
import { ListItem, Pagination as ContentPagination } from '@/types/Content';

type ArticleListProps = {
  items: ListItem[],
  pagination?: ContentPagination,
};

const ArticleList: React.FC<ArticleListProps> = ({ items, pagination }) => (
    <ProseContainer>
      <Prose as={ 'div' } className="content-links-reverse">
          { items.map((item) => (
            <ArticleListItem item={ item.contentItem } key={ `${item.contentItem.uri}` } />
          )) }
      </Prose>

      { (pagination?.hasNext || pagination?.hasPrevious) && <Pagination { ...pagination } className="mt-20" /> }
    </ProseContainer>
);

export default ArticleList;
