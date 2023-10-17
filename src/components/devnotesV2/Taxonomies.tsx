import Link from 'next/link';
import React from 'react';
import cn from '@/helpers/cn';
import useTranslation from '@/hooks/useTranslation';
import { TaxonomyRelation } from '@/types/Content';

type TaxonomiesProps = {
  collection: string;
  taxonomies: TaxonomyRelation[];
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

  if (!taxonomies.length) {
    return null;
  }

  return (
    <div>
      <span className={cn('font-semibold m-0 mr-1', hideLabel && 'sr-only')}>
        {t(`taxonomy_label_${collection}`, {}, collection)}:
      </span>
      {taxonomies.map((taxonomy) => (
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

export default Taxonomies;
