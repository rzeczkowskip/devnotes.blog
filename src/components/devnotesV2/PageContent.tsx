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
    default:
      throw new Error(`Unsupported page type ${pageType}`);
  }
};

const PageContent: React.FC<PageContentProps> = ({ page, children }) => {
  const { contentItem, relatedItems, listItems, taxonomies } = page;
  const pageType = getPageType(contentItem);

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

  if (pageType === PageType.Content) {
    const image = contentItem.metadata?.image;

    return (
      <Container>
        {!contentItem.metadata.noTitle && (
          <Header
            title={contentItem.title}
            subtitle={subtitle}
            date={contentItem.date}
          />
        )}

        {hasTaxonomies(taxonomies) && (
          <footer className="my-6 pb-6 border-b prose prose-container">
            <Taxonomies
              collection={'tags'}
              taxonomies={taxonomies}
              labelPrefix="#"
            />
          </footer>
        )}

        <div className={cn('prose', 'prose-container')}>
          {image && (
            <Image
              src={image}
              alt=""
              baseUri={contentItem.assetsBaseUri}
              className="rounded mx-auto mb-8"
              priority
            />
          )}

          <MarkdownContent
            markdown={contentItem.content}
            assetBaseUri={contentItem.assetsBaseUri}
          />
        </div>
      </Container>
    );
  }
};

export default PageContent;
