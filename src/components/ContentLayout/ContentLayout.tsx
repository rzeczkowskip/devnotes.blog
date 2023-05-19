import React, { PropsWithChildren } from 'react';
import ArticleContent from '@/components/ArticleContent';
import ArticleList from '@/components/ArticleList';
import Container from '@/components/Container';
import Hero from '@/components/Hero';
import ProseContainer from '@/components/ProseContainer';
import Section from '@/components/Section';
import TagList from '@/components/TagList';
import useTranslation from '@/hooks/useTranslation';
import { Page } from '@/types/Content';

type ContentLayoutProps = PropsWithChildren<{
  page: Page,
}>;

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
            <ProseContainer>
              <ArticleContent markdown={ contentItem.content } assetBaseUri={ contentItem.assetsBaseUri }/>
            </ProseContainer>
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
