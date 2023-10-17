import Link from 'next/link';
import React from 'react';
import cn from '@/helpers/cn';
import { ListItem } from '@/types/Content';

type TaxonomiesListProps = {
  collection: string;
  listItems: ListItem[];
};

const TaxonomiesList: React.FC<TaxonomiesListProps> = ({
  collection,
  listItems,
}) => (
  <ul
    className={cn(
      'list-none prose',
      collection === 'tags' && 'flex flex-wrap justify-center',
    )}
  >
    {listItems.map((item) => (
      <li key={item.contentItem.uri} className="m-2 p-0">
        <Link href={item.contentItem.canonicalUri}>
          {item.contentItem.title}
        </Link>
      </li>
    ))}
  </ul>
);

export default TaxonomiesList;
