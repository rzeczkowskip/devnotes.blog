import React, { PropsWithChildren } from 'react';
import { ContentItem, Page } from '@/types/Content';

type PageContentProps = PropsWithChildren<{
  page: Page;
}>;

enum PageType {
  Content = 'content',
  ContentList = 'contentList',
  TaxonomiesList = 'taxonomies',
}

const getPageType = (contentItem: ContentItem): PageType => {
  if (contentItem.list?.collection) {
    return contentItem.list?.isTaxonomyList
      ? PageType.TaxonomiesList
      : PageType.ContentList;
  }

  return PageType.Content;
};

const PageContent: React.FC<PageContentProps> = ({ page }) => {
  const { contentItem, relatedItems, listItems, taxonomies } = page;
  const pageType = getPageType(contentItem);

  if (pageType === PageType.ContentList) {
    return <div></div>;
  }

  if (pageType === PageType.TaxonomiesList) {
    return <div></div>;
  }

  if (pageType === PageType.Content) {
    return <div></div>;
  }

  throw new Error(`Unsupported page type ${pageType}`);
};

export default PageContent;
