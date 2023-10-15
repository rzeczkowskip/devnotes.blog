import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import ArticleContent from '@/components/ArticleContent';
import ColoredText from '@/components/devnotesV2/ColoredText';
import Container from '@/components/devnotesV2/Container';
import ArticleDate from '@/components/devnotesV2/Content/ArticleDate';
import cn from '@/helpers/cn';
import useTranslation from '@/hooks/useTranslation';
import { ContentItem, Page, TaxonomyRelation } from '@/types/Content';

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

const hasTaxonomies = (taxonomies: Page['taxonomies']) =>
  Object.values(taxonomies).some((items) => items.length > 0);

type TaxonomiesProps = {
  collection: string;
  taxonomies: Page['taxonomies'];
  as?: React.FC<Partial<TaxonomyRelation> & Pick<TaxonomyRelation, 'uri'>>;
};

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
    <div className="prose">
      <div className="flex no-wrap">
        <div className="mr-1 font-semibold">
          {t(`taxonomy_label_${collection}`, {}, collection)}:
        </div>
        <div className="w-full">
          {taxonomies[collection].map((taxonomy) => (
            <span className="mr-1" key={taxonomy.uri}>
              {TaxonomyComponent ? (
                <TaxonomyComponent {...taxonomy} />
              ) : (
                <Link href={taxonomy.uri}>{taxonomy.title}</Link>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
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
    const subtitle =
      contentItem.metadata?.subtitle || contentItem.metadata?.summary;

    return (
      <Container>
        <article>
          {!contentItem.metadata.noTitle && (
            <header className="prose prose-sm max-w-full md:max-w-full md:prose mb-6 border-b">
              <h1 className={cn('mt-0 mb-6')}>
                <ColoredText>{contentItem.title}</ColoredText>
              </h1>

              <div className="container-prose">
                {subtitle && <p>{subtitle}</p>}

                {contentItem.date && (
                  <p>
                    <ArticleDate
                      date={contentItem.date}
                      className={cn('text-muted')}
                    />
                  </p>
                )}
              </div>
            </header>
          )}

          {hasTaxonomies(taxonomies) && (
            <footer className="my-6 pb-6 border-b">
              <Taxonomies collection={'categories'} taxonomies={taxonomies} />
              <Taxonomies collection={'tags'} taxonomies={taxonomies} />
            </footer>
          )}

          {contentItem.content}
        </article>
      </Container>
    );
  }

  throw new Error(`Unsupported page type ${pageType}`);
};

export default PageContent;
