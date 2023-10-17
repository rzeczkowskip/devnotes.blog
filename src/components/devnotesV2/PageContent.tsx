import Link from 'next/link';
import React, { PropsWithChildren } from 'react';
import ArticleDate from '@/components/devnotesV2/ArticleDate';
import ColoredText from '@/components/devnotesV2/ColoredText';
import Container from '@/components/devnotesV2/Container';
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
  ContentList = 'contentList',
  TaxonomiesList = 'taxonomies',
}

const getPageType = (contentItem: ContentItem): PageType => {
  if (contentItem.list?.collection || contentItem.isTaxonomy) {
    return contentItem.list?.isTaxonomyList
      ? PageType.TaxonomiesList
      : PageType.ContentList;
  }

  return PageType.Content;
};

const hasTaxonomies = (
  taxonomies: Page['taxonomies'],
  taxonomyCollection?: string,
) =>
  Object.entries(taxonomies).some(([taxonomy, items]) => {
    if (taxonomyCollection && taxonomyCollection !== taxonomy) {
      return false;
    }

    return items.length > 0;
  });

type TaxonomiesProps = {
  collection: string;
  taxonomies: Page['taxonomies'];
  hideLabel?: boolean;
  labelPrefix?: string;
  as?: React.FC<Partial<TaxonomyRelation> & Pick<TaxonomyRelation, 'uri'>>;
};

const Taxonomies: React.FC<TaxonomiesProps> = ({
  collection,
  taxonomies,
  hideLabel,
  labelPrefix,
}) => {
  const { t } = useTranslation();

  if (taxonomies?.[collection]?.length === 0) {
    return null;
  }

  return (
    <div>
      <span className={cn('font-semibold m-0 mr-1', hideLabel && 'sr-only')}>
        {t(`taxonomy_label_${collection}`, {}, collection)}:
      </span>
      {taxonomies[collection].map((taxonomy) => (
        <Link
          href={taxonomy.uri}
          key={taxonomy.uri}
          className={'mr-1 inline-block whitespace-nowrap'}
        >
          {labelPrefix || ''}
          {taxonomy.title}
        </Link>
      ))}
    </div>
  );
};

const PageContent: React.FC<PageContentProps> = ({ page }) => {
  const { contentItem, relatedItems, listItems, taxonomies } = page;
  const pageType = getPageType(contentItem);
  const { locale } = useTranslation();

  if (pageType === PageType.ContentList) {
    const { pagination } = contentItem;
    const subtitle =
      contentItem.metadata?.subtitle || contentItem.metadata?.summary;

    return (
      <Container>
        {contentItem.isTaxonomy && (
          <header className="prose prose-sm md:prose mb-6 border-b">
            <h1 className={cn('mt-0 mb-6')}>
              <ColoredText>
                {contentItem.collection === 'tags' && '#'}
                {contentItem.title}
              </ColoredText>
            </h1>

            <div className="prose-container">
              {subtitle && <p>{subtitle}</p>}
            </div>
          </header>
        )}

        <div className={'grid sm:grid-cols-2 lg:grid-cols-3 gap-8'}>
          {listItems.map((item) => (
            <article
              className={cn(
                'mb-6 pb-6 border-b-8 flex flex-col items-start justify-start',
              )}
              key={item.contentItem.contentId}
            >
              <Link
                href={item.contentItem.uri}
                className="hover:underline block"
              >
                <h1 className={cn('mt-0 mb-4 text-2xl font-semibold')}>
                  <ColoredText>{item.contentItem.title}</ColoredText>
                </h1>

                {item.contentItem.metadata?.image && (
                  <Image
                    src={item.contentItem.metadata?.image}
                    alt=""
                    baseUri={item.contentItem.assetsBaseUri}
                    className="rounded mx-auto mb-6"
                    priority
                  />
                )}
              </Link>

              <div className="prose">
                {item.contentItem.metadata?.summary && (
                  <div className={'mb-6'}>
                    {item.contentItem.metadata?.summary}
                  </div>
                )}

                {hasTaxonomies(item.taxonomies, 'tags') && (
                  <div className={'mb-6'}>
                    <Taxonomies
                      collection={'tags'}
                      taxonomies={item.taxonomies}
                      hideLabel
                      labelPrefix="#"
                    />
                  </div>
                )}
              </div>

              <div className={'mt-auto mb-0'}>
                {item.contentItem.date && (
                  <ArticleDate
                    date={item.contentItem.date}
                    locale={locale}
                    className={cn('text-muted')}
                  />
                )}
              </div>
            </article>
          ))}
        </div>
        {(pagination?.hasNext || pagination?.hasPrevious) && (
          <Pagination {...pagination} className="mt-20" />
        )}
      </Container>
    );
  }

  if (pageType === PageType.TaxonomiesList) {
    const subtitle =
      contentItem.metadata?.subtitle || contentItem.metadata?.summary;

    return (
      <Container>
        <header className="prose prose-sm md:prose mb-6 border-b">
          <h1 className={cn('mt-0 mb-6')}>
            <ColoredText>{contentItem.title}</ColoredText>
          </h1>

          <div className="prose-container">
            {subtitle && <p>{subtitle}</p>}

            {contentItem.date && (
              <p>
                <ArticleDate
                  date={contentItem.date}
                  className={cn('text-muted')}
                  locale={locale}
                />
              </p>
            )}
          </div>
        </header>

        <ul
          className={cn(
            'list-none prose',
            contentItem.list?.collection === 'tags' &&
              'flex flex-wrap justify-center',
          )}
        >
          {listItems.map((item) => (
            <li key={item.contentItem.uri} className="m-2 p-0">
              <Link href={item.contentItem.canonicalUri}>
                {item.contentItem.title}
              </Link>
            </li>
          ))}
        </ul>

        <Taxonomies
          collection={'tags'}
          taxonomies={taxonomies}
          labelPrefix="#"
        />
      </Container>
    );
  }

  if (pageType === PageType.Content) {
    const subtitle =
      contentItem.metadata?.subtitle || contentItem.metadata?.summary;
    const image = contentItem.metadata?.image;

    return (
      <Container>
        <div>
          {!contentItem.metadata.noTitle && (
            <header className="prose prose-sm md:prose mb-6 border-b">
              <h1 className={cn('mt-0 mb-6')}>
                <ColoredText>{contentItem.title}</ColoredText>
              </h1>

              <div className="prose-container">
                {subtitle && <p>{subtitle}</p>}

                {contentItem.date && (
                  <p>
                    <ArticleDate
                      date={contentItem.date}
                      className={cn('text-muted')}
                      locale={locale}
                    />
                  </p>
                )}
              </div>
            </header>
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
        </div>
      </Container>
    );
  }

  throw new Error(`Unsupported page type ${pageType}`);
};

export default PageContent;
