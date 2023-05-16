import React from 'react';
import Hero from '@/components/Hero';
import { Page } from '@/types/Content';

type ContentLayoutProps = {
  page: Page,
};

const ContentLayout: React.FC<ContentLayoutProps> = (
  { page: { contentItem, taxonomies } },
) => {
  const title = `${contentItem.collection === 'tags' ? '#' : ''}${contentItem.title}`;

  return (
    <>
      <Hero
        title={ title }
        subtitle={ contentItem.metadata?.subtitle }
        date={ contentItem.date }
        links={ taxonomies?.categories?.slice(0, 1) }
      />
    </>
  );
};

export default ContentLayout;
