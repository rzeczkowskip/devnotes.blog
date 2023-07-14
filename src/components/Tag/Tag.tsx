import Link from 'next/link';
import React from 'react';
import { TaxonomyRelation } from '@/types/Content';

type TagProps = Partial<TaxonomyRelation> & Pick<TaxonomyRelation, 'uri'>;

const Tag: React.FC<TagProps> = ({ title, uri }) => (
  <Link href={uri}>#{title}</Link>
);

export default Tag;
