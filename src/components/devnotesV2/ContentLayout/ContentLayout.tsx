import React, { PropsWithChildren } from 'react';
import ArticleContent from '@/components/devnotesV2/ArticleContent';
import ArticleList from '@/components/devnotesV2/ArticleList';
import ArticleMeta from '@/components/devnotesV2/ArticleMeta/ArticleMeta';
import Container from '@/components/devnotesV2/Container';
import HeroTitle from '@/components/devnotesV2/HeroTitle/HeroTitle';
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

const hasTaxonomies = (taxonomies: Page['taxonomies']) =>
  Object.values(taxonomies).some((items) => items.length > 0);

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

  const mainContentWrapper =
    !contentItem.metadata?.noTitle && contentItem.content ? 'article' : 'div';

  return (
    <>
      <Section.Section as={mainContentWrapper}>
        <Container>
          {!contentItem.metadata?.noTitle ? (
            <header className="pb-4 mb-8">
              <HeroTitle
                title={title}
                subtitle={contentItem.metadata?.subtitle}
                date={contentItem.date}
                className=""
              />
            </header>
          ) : null}

          {children}

          {contentItem.content && (
            <ArticleContent
              markdown={contentItem.content}
              assetBaseUri={contentItem.assetsBaseUri}
              image={contentItem.metadata?.image}
            />
          )}

          {hasTaxonomies(taxonomies) && (
            <footer className="pt-12 pb-4">
              <Taxonomies collection="tags" taxonomies={taxonomies} />
              <Taxonomies collection="categories" taxonomies={taxonomies} />
            </footer>
          )}
        </Container>
      </Section.Section>

      {relatedItems.length > 0 && (
        <Section.Section background={'gray'}>
          <Container>
            <Section.Title>{t('related_content_label')}</Section.Title>
            <ArticleList
              items={relatedItems}
              pagination={contentItem.pagination}
            />
          </Container>
        </Section.Section>
      )}

      {listItems?.length > 0 && (
        <Section.Section>
          <Container>
            {contentItem.pagination?.collection === 'tags' ? (
              <TagList items={listItems} />
            ) : (
              <ArticleList
                items={listItems}
                pagination={contentItem.pagination}
              />
            )}
          </Container>
        </Section.Section>
      )}
    </>
  );
};

export default ContentLayout;
