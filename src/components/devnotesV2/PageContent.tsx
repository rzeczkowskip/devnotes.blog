import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import ArticleDate from '@/components/devnotesV2/ArticleDate';
import ColoredText from '@/components/devnotesV2/ColoredText';
import Container from '@/components/devnotesV2/Container';
import ContentList from '@/components/devnotesV2/ContentList/ContentList';
import TaxonomiesList from '@/components/devnotesV2/ContentList/TaxonomiesList';
import Header from '@/components/devnotesV2/Header';
import Image from '@/components/devnotesV2/Image';
import MarkdownContent from '@/components/devnotesV2/MarkdownContent/MarkdownContent';
import Pagination from '@/components/devnotesV2/Pagination/Pagination';
import TextPage from '@/components/devnotesV2/TextPage';
import cn from '@/helpers/cn';
import useTranslation from '@/hooks/useTranslation';
import { ContentItem, Page, TaxonomyRelation } from '@/types/Content';

type PageContentProps = PropsWithChildren<{
  page: Page;
}>;

enum PageType {
  Content = 'content',
  List = 'contentList',
  Taxonomies = 'taxonomies',
}

const getPageType = (contentItem: ContentItem): PageType => {
  if (contentItem.list?.collection || contentItem.isTaxonomy) {
    return contentItem.list?.isTaxonomyList
      ? PageType.Taxonomies
      : PageType.List;
  }

  return PageType.Content;
};

const ContentMapper: React.FC<PageContentProps> = ({ page }) => {
  const pageType = getPageType(page.contentItem);

  switch (pageType) {
    case PageType.List:
      return (
        <ContentList
          items={page.listItems}
          pagination={page.contentItem?.pagination}
        />
      );
    case PageType.Taxonomies:
      return (
        <TaxonomiesList
          collection={page.contentItem.list?.collection || ''}
          listItems={page.listItems}
        />
      );
    case PageType.Content:
      return <TextPage item={page.contentItem} taxonomies={page.taxonomies} />;
    default:
      throw new Error(`Unsupported page type ${pageType}`);
  }
};

const PageContent: React.FC<PageContentProps> = ({ page, children }) => {
  const { contentItem } = page;

  const subtitle =
    contentItem.metadata?.subtitle || contentItem.metadata?.summary;
  const shouldShowHeader = !contentItem.metadata.noTitle;

  if (children) {
    return children;
  }

  return (
    <Container>
      {shouldShowHeader && (
        <Header
          title={contentItem.title}
          subtitle={subtitle}
          date={contentItem.date}
        />
      )}

      <ContentMapper page={page} />
    </Container>
  );
};

export default PageContent;
