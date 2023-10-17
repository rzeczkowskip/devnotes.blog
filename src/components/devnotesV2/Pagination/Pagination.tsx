import React from 'react';
import PaginationLink from '@/components/Pagination/PaginationLink';
import useTranslation from '@/hooks/useTranslation';
import { Pagination as ContentPagination } from '@/types/Content';

type PaginationProps = ContentPagination & {
  className?: string;
};

const Pagination: React.FC<PaginationProps> = ({
  collection,
  links,
  className,
}) => {
  const { t } = useTranslation();

  const previousText = t(
    `pagination_previous_${collection}`,
    {},
    t('pagination_previous'),
  );
  const nextText = t(`pagination_next_${collection}`, {}, t('pagination_next'));

  return (
    <nav
      className={`text-sm sm:text-base flex justify-between items-center content-links ${
        className || ''
      }`}
    >
      {links?.previous && (
        <PaginationLink href={links.previous} className="ml-0 mr-auto">
          <span aria-hidden="true">←</span> {previousText}
        </PaginationLink>
      )}

      {links?.next && (
        <PaginationLink href={links.next} className="ml-auto">
          {nextText} <span aria-hidden="true">→</span>
        </PaginationLink>
      )}
    </nav>
  );
};

export default Pagination;
