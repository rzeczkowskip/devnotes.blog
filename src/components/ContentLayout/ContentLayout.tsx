import Link from 'next/link';
import React, { Component, PropsWithChildren } from 'react';
import ArticleContent from '@/components/ArticleContent';
import ArticleList from '@/components/ArticleList';
import Container from '@/components/Container';
import Hero from '@/components/Hero';
import ProseContainer from '@/components/ProseContainer';
import Section from '@/components/Section';
import Tag from '@/components/Tag/Tag';
import TagList from '@/components/TagList';
import useTranslation from '@/hooks/useTranslation';
import { Page, TaxonomyRelation } from '@/types/Content';

type ContentLayoutProps = PropsWithChildren<{
  page: Page,
}>;

type TaxonomiesProps = {
  collection: string,
  taxonomies: Page['taxonomies'],
  as?: React.FC<Partial<TaxonomyRelation> & Pick<TaxonomyRelation, 'uri'>>,
};

const hasTaxonomies = (taxonomies: Page['taxonomies']) => Object.values(taxonomies)
  .some((items) => items.length > 0);

const Taxonomies: React.FC<TaxonomiesProps> = ({
  collection,
  taxonomies,
  as: TaxonomyComponent,
}) => {
  const { t } = useTranslation();

  if (taxonomies?.[collection]?.length === 0) {
    return null;
  }

  return (
    <div className="textsm content-links">
      <div className="flex no-wrap mb-2">
        <div className="mr-1 font-bold">{ t(`taxonomy_label_${collection}`, {}, collection) }:</div>
        <div className="w-full">
          { taxonomies[collection].map((taxonomy) => (
            <span className="mr-1" key={ taxonomy.uri }>
              {
                TaxonomyComponent
                  ? <TaxonomyComponent { ...taxonomy } />
                  : <Link href={ taxonomy.uri }>{ taxonomy.title }</Link>
              }
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const ContentLayout: React.FC<ContentLayoutProps> = ({
  page: {
    contentItem, listItems, relatedItems, taxonomies,
  },
  children,
}) => {
  const title = `${contentItem.collection === 'tags' ? '#' : ''}${contentItem.title}`;
  const { t } = useTranslation();

  return (
    <>
      <Hero
        title={ title }
        subtitle={ contentItem.metadata?.subtitle }
        date={ contentItem.date }
        links={ taxonomies?.categories?.slice(0, 1) }
      />

      { children }

      { contentItem.content && (
        <Section.Section paddingY={ children ? 'both' : 'bottom' }>
          <Container>
            <ArticleContent
              markdown={ contentItem.content }
              assetBaseUri={ contentItem.assetsBaseUri }
              image={ contentItem.metadata?.image }
            />

            {
              hasTaxonomies(taxonomies)
                ? (
                  <ProseContainer className="mt-20">
                    <Taxonomies taxonomies={ taxonomies } collection="tags" as={ Tag } />
                    <Taxonomies taxonomies={ taxonomies } collection="categories" />
                  </ProseContainer>
                )
                : null
            }
          </Container>
        </Section.Section>
      ) }

      { listItems?.length > 0 && (
        <Section.Section background={ 'gray' }>
          <Container>
            <ProseContainer>
              { contentItem.pagination?.collection === 'tags'
                ? <TagList items={ listItems } />
                : (
                  <ArticleList
                    items={ listItems }
                    pagination={ contentItem.pagination }
                  />
                )
              }
            </ProseContainer>
          </Container>
        </Section.Section>
      ) }

      { relatedItems?.length > 0 && (
        <Section.Section background={ 'gray' }>
          <Container>
            <ProseContainer>
              <Section.Title>
                { t('related_content_label') }
              </Section.Title>
              <ArticleList
                items={ relatedItems }
                pagination={ contentItem.pagination }
              />
            </ProseContainer>
          </Container>
        </Section.Section>
      ) }
    </>
  );
};

export default ContentLayout;
