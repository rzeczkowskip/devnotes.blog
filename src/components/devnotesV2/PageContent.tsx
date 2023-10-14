import React, { PropsWithChildren } from 'react';
import { Page } from '@/types/Content';

type PageContentProps = PropsWithChildren<{
  page: Page;
}>;

const PageContent: React.FC<PageContentProps> = ({ page }) => {
  console.log(page);
  return <div></div>;
};

export default PageContent;
