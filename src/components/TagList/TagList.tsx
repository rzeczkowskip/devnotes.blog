import React from 'react';
import Container from '@/components/Container';
import Tag from '@/components/Tag/Tag';
import { ListItem } from '@/types/Content';

type TagListProps = {
  items: ListItem[],
};

const TagList: React.FC<TagListProps> = ({ items }) => (
    <Container size="small">
      <div className="flex flex-wrap justify-center text-lg font-extrabold content-links-reverse">
        { items.map((item) => (
          <div className="mx-2 my-4" key={ item.contentItem.uri }>
            <Tag label={ item.contentItem.title } uri={ item.contentItem.canonicalUri } />
          </div>
        )) }
      </div>
    </Container>
);

export default TagList;
