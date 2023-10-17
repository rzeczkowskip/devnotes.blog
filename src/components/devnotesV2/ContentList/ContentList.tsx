import React from 'react';
import ContentListItem from '@/components/devnotesV2/ContentList/ContentListItem';
import Pagination from '@/components/devnotesV2/Pagination/Pagination';
import { ContentItem, ListItem } from '@/types/Content';

type ContentListProps = {
  items: ListItem[];
  pagination?: ContentItem['pagination'];
};

const ContentList: React.FC<ContentListProps> = ({ items, pagination }) => (
  <div>
    <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-8'}>
      {items.map((item) => (
        <ContentListItem item={item} key={item.contentItem.uri} />
      ))}
    </div>

    {pagination && <Pagination {...pagination} className="mt-20" />}
  </div>
);

export default ContentList;
