import React from 'react';
import Image from '@/components/devnotesV2/Image';
import MarkdownContent from '@/components/devnotesV2/MarkdownContent/MarkdownContent';
import Taxonomies from '@/components/devnotesV2/Taxonomies';
import cn from '@/helpers/cn';
import useTaxonomies from '@/hooks/useTaxonomies';
import { ContentItem, Page } from '@/types/Content';

type ContentProps = {
  item: ContentItem;
  taxonomies: Page['taxonomies'];
};

const TextPage: React.FC<ContentProps> = ({ item, taxonomies }) => {
  const { hasTaxonomies, getTaxonomies } = useTaxonomies(taxonomies);
  const image = item.metadata?.image;

  return (
    <>
      {hasTaxonomies() && (
        <footer className="my-6 pb-6 border-b prose prose-container">
          <Taxonomies collection={'tags'} taxonomies={getTaxonomies('tags')} />
          <Taxonomies
            collection={'categories'}
            taxonomies={getTaxonomies('categories')}
          />
        </footer>
      )}

      <div className={cn('prose', 'prose-container')}>
        {image && (
          <Image
            src={image}
            alt=""
            baseUri={item.assetsBaseUri}
            className="rounded mx-auto mb-8"
            priority
          />
        )}

        <MarkdownContent
          markdown={item.content}
          assetBaseUri={item.assetsBaseUri}
        />
      </div>
    </>
  );
};

export default TextPage;
