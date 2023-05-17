import React, { PropsWithChildren } from 'react';
import ArticleContent from '@/components/ArticleContent';
import ArticleList from '@/components/ArticleList';
import Container from '@/components/Container';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import TagList from '@/components/TagList';
import { Page } from '@/types/Content';

type ContentLayoutProps = PropsWithChildren<{
  page: Page,
}>;

const ContentLayout: React.FC<ContentLayoutProps> = ({
  page: { contentItem, listItems, taxonomies },
  children,
}) => {
  const title = `${contentItem.collection === 'tags' ? '#' : ''}${contentItem.title}`;

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
              <ArticleContent markdown={ contentItem.content } />
            </Container>
          </Section.Section>
        ) }

        { listItems?.length > 0 && (
          <Section.Section background={ 'gray' }>
            <Container>
              { contentItem.pagination?.collection === 'tags'
                ? <TagList items={ listItems } />
                : (
                  <ArticleList
                    items={ listItems }
                    pagination={ contentItem.pagination }
                  />
                )
              }
            </Container>
          </Section.Section>
        ) }
    </>
  );
};

export default ContentLayout;
