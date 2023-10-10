import React, { PropsWithChildren } from 'react';
import ArticleContent from '@/components/devnotesV2/ArticleContent';
import ArticleList from '@/components/devnotesV2/ArticleList';
import ArticleMeta from '@/components/devnotesV2/ArticleMeta/ArticleMeta';
import Container from '@/components/devnotesV2/Container';
import HeroTitle from '@/components/devnotesV2/HeroTitle/HeroTitle';
import ProseContainer from '@/components/devnotesV2/ProseContainer';
import Section from '@/components/devnotesV2/Section';
import TagList from '@/components/devnotesV2/TagList';
import useTranslation from '@/hooks/useTranslation';
import { Page, TaxonomyRelation } from '@/types/Content';

type ContentLayoutProps = PropsWithChildren<{
  page: Page;
}>;

type TaxonomiesProps = {
  collection: string;
  taxonomies: Page['taxonomies'];
  as?: React.FC<Partial<TaxonomyRelation> & Pick<TaxonomyRelation, 'uri'>>;
};

const Taxonomies: React.FC<TaxonomiesProps> = ({ collection, taxonomies }) => {
  const { t } = useTranslation();

  if (!taxonomies?.[collection]?.length) {
    return null;
  }

  return (
    <ArticleMeta
      title={t(`taxonomy_label_${collection}`, {}, collection)}
      links={taxonomies?.[collection]}
    />
  );
};

const ContentLayout: React.FC<ContentLayoutProps> = ({
  page: { contentItem, listItems, relatedItems, taxonomies },
  children,
}) => {
  const title = `${contentItem.collection === 'tags' ? '#' : ''}${
    contentItem.title
  }`;
  const { t } = useTranslation();

  return (
    <>
      {!contentItem.metadata?.noTitle ? (
        <Container className="pb-4 mb-12">
          <HeroTitle
            title={title}
            subtitle={contentItem.metadata?.subtitle}
            date={contentItem.date}
          />
        </Container>
      ) : null}

      {children}

      {contentItem.content && (
        <Container>
          <div className="grid grid-cols-4 grid-flow-row gap-8">
            <div className="col-span-1">
              <Taxonomies collection="tags" taxonomies={taxonomies} />
              <Taxonomies collection="categories" taxonomies={taxonomies} />
              {relatedItems.length > 0 && (
                <ArticleMeta
                  title={t('related_content_label')}
                  links={relatedItems.map(
                    (relatedItem) => relatedItem.contentItem,
                  )}
                  inlineLinks={false}
                />
              )}
            </div>
            <div className="col-span-3">
              <ArticleContent
                markdown={contentItem.content}
                assetBaseUri={contentItem.assetsBaseUri}
                image={contentItem.metadata?.image}
              />
            </div>
          </div>
        </Container>
      )}

      {listItems?.length > 0 && (
        <Section.Section>
          <Container>
            <ProseContainer>
              {contentItem.pagination?.collection === 'tags' ? (
                <TagList items={listItems} />
              ) : (
                <ArticleList
                  items={listItems}
                  pagination={contentItem.pagination}
                />
              )}
            </ProseContainer>
          </Container>
        </Section.Section>
      )}
    </>
  );
};

export default ContentLayout;
