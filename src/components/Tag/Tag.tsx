import Link from 'next/link';
import React from 'react';

type TagProps = {
  label: string,
  uri: string,
};

const Tag: React.FC<TagProps> = ({ label, uri }) => (
    <Link href={ uri }>
      #{ label }
    </Link>
);

export default Tag;
