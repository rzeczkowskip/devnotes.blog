import Link from 'next/link';
import React from 'react';
import ArticleDate from '@/components/devnotesV2/ArticleDate';
import ColoredText from '@/components/devnotesV2/ColoredText';
import Image from '@/components/devnotesV2/Image';
import Taxonomies from '@/components/devnotesV2/Taxonomies';
import cn from '@/helpers/cn';
import useTaxonomies from '@/hooks/useTaxonomies';
import useTranslation from '@/hooks/useTranslation';
import { ListItem } from '@/types/Content';

type ContentListItemProps = {
  item: ListItem;
};

const ContentListItem: React.FC<ContentListItemProps> = ({ item }) => {
  const { contentItem } = item;

  const { hasTaxonomies, getTaxonomies } = useTaxonomies(item.taxonomies);
  const { locale } = useTranslation();

  return (
    <article
      className={cn(
        'mb-6 pb-6 border-b-8 flex flex-col items-start justify-start',
      )}
      key={contentItem.contentId}
    >
      <Link href={contentItem.uri} className="hover:underline block">
        <h1 className={cn('mt-0 mb-4 text-2xl font-semibold')}>
          <ColoredText>{contentItem.title}</ColoredText>
        </h1>

        {contentItem.metadata?.image && (
          <Image
            src={contentItem.metadata?.image}
            alt=""
            baseUri={contentItem.assetsBaseUri}
            className="rounded mx-auto mb-6"
            priority
          />
        )}
      </Link>

      <div className="prose">
        {contentItem.metadata?.summary && (
          <div className={'mb-6'}>{contentItem.metadata?.summary}</div>
        )}

        {hasTaxonomies('tags') && (
          <div className={'mb-6'}>
            <Taxonomies
              collection={'tags'}
              taxonomies={getTaxonomies('tags')}
              hideLabel
            />
          </div>
        )}
      </div>

      <div className={'mt-auto mb-0'}>
        {contentItem.date && (
          <ArticleDate
            date={contentItem.date}
            locale={locale}
            className={cn('text-muted')}
          />
        )}
      </div>
    </article>
  );
};

export default ContentListItem;
