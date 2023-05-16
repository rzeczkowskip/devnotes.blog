import React, { PropsWithChildren } from 'react';
import ArticleContent from '@/components/ArticleContent';
import Hero from '@/components/Hero';
import Section from '@/components/Section';
import { Page } from '@/types/Content';

type ContentLayoutProps = PropsWithChildren<{
  page: Page,
}>;

const ContentLayout: React.FC<ContentLayoutProps> = ({
  page: { contentItem, taxonomies },
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

      <Section.Section paddingY={ 'bottom' }>
        { contentItem.content && <ArticleContent markdown={ contentItem.content } /> }
      </Section.Section>
    </>
  );
};

export default ContentLayout;
