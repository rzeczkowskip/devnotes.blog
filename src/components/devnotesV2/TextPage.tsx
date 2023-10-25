import React from 'react';
import Container from '@/components/devnotesV2/Container';
import ContentList from '@/components/devnotesV2/ContentList/ContentList';
import Header from '@/components/devnotesV2/Header';
import Image from '@/components/devnotesV2/Image';
import MarkdownContent from '@/components/devnotesV2/MarkdownContent/MarkdownContent';
import Taxonomies from '@/components/devnotesV2/Taxonomies';
import cn from '@/helpers/cn';
import useTaxonomies from '@/hooks/useTaxonomies';
import useTranslation from '@/hooks/useTranslation';
import { ContentItem, Page } from '@/types/Content';

type ContentProps = {
  item: ContentItem;
  taxonomies: Page['taxonomies'];
  relatedItems: Page['relatedItems'];
};

const TextPage: React.FC<ContentProps> = ({
  item,
  taxonomies,
  relatedItems,
}) => {
  const { hasTaxonomies, getTaxonomies } = useTaxonomies(taxonomies);
  const { t } = useTranslation();
  const image = item.metadata?.image;

  return (
    <>
      <Container>
        {hasTaxonomies() && (
          <footer className="my-6 pb-6 border-b prose prose-container">
            <Taxonomies
              collection={'tags'}
              taxonomies={getTaxonomies('tags')}
            />
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
      </Container>

      {relatedItems.length > 0 && (
        <section className="mt-16 border-t-4 pt-16 bg-slate-100">
          <Container>
            <Header title={t('related_content_label')} />

            <ContentList items={relatedItems} />
          </Container>
        </section>
      )}
    </>
  );
};

export default TextPage;
