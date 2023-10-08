import React from 'react';
import Container from '@/components/devnotesV2/Container';
import Tag from '@/components/devnotesV2/Tag/Tag';
import { ListItem } from '@/types/Content';

type TagListProps = {
  items: ListItem[];
};

const TagList: React.FC<TagListProps> = ({ items }) => (
  <Container size="small">
    <div className="flex flex-wrap justify-center text-lg font-extrabold content-links-reverse">
      {items.map((item) => (
        <div className="mx-2 my-4" key={item.contentItem.uri}>
          <Tag
            title={item.contentItem.title}
            uri={item.contentItem.canonicalUri}
          />
        </div>
      ))}
    </div>
  </Container>
);

export default TagList;
