import React, { PropsWithChildren } from 'react';
import Container from '@/components/devnotesV2/Container';
import ContentList from '@/components/devnotesV2/ContentList/ContentList';
import TaxonomiesList from '@/components/devnotesV2/ContentList/TaxonomiesList';
import Header from '@/components/devnotesV2/Header';
import TextPage from '@/components/devnotesV2/TextPage';
import { ContentItem, Page } from '@/types/Content';

type PageContentProps = PropsWithChildren<{
  page: Page;
}>;

enum PageType {
  Content = 'content',
  List = 'contentList',
  Taxonomies = 'taxonomies',
}

type ContentMapperProps = PageContentProps & {
  pageType: PageType;
};

const getPageType = (contentItem: ContentItem): PageType => {
  if (contentItem.list?.collection || contentItem.isTaxonomy) {
    return contentItem.list?.isTaxonomyList
      ? PageType.Taxonomies
      : PageType.List;
  }

  return PageType.Content;
};

const ContentMapper: React.FC<ContentMapperProps> = ({ page, pageType }) => {
  switch (pageType) {
    case PageType.List:
      return (
        <Container>
          <ContentList
            items={page.listItems}
            pagination={page.contentItem?.pagination}
          />
        </Container>
      );
    case PageType.Taxonomies:
      return (
        <Container>
          <TaxonomiesList
            collection={page.contentItem.list?.collection || ''}
            listItems={page.listItems}
          />
        </Container>
      );
    case PageType.Content:
      return (
        <TextPage
          item={page.contentItem}
          taxonomies={page.taxonomies}
          relatedItems={page.relatedItems}
        />
      );
    default:
      throw new Error(`Unsupported page type ${pageType}`);
  }
};

const PageContent: React.FC<PageContentProps> = ({ page, children }) => {
  const { contentItem } = page;
  const pageType = getPageType(page.contentItem);

  const subtitle =
    contentItem.metadata?.subtitle || contentItem.metadata?.summary;
  const shouldShowHeader = !contentItem.metadata.noTitle;

  return (
    <>
      {shouldShowHeader && (
        <Container>
          <Header
            title={contentItem.title}
            subtitle={subtitle}
            date={contentItem.date}
            proseWidth={pageType === PageType.Content}
          />
        </Container>
      )}

      {children || <ContentMapper page={page} pageType={pageType} />}
    </>
  );
};

export default PageContent;
