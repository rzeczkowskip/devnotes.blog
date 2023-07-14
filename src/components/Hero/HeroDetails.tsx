import Link from 'next/link';
import React, { Fragment } from 'react';
import { HeroDetailsProps } from './types';
import ArticleDate from '@/components/ArticleDate';
import Container from '@/components/Container';

const HeroDetails: React.FC<HeroDetailsProps> = ({ date, links }) => {
  if (!date && !links) {
    return null;
  }

  return (
    <Container className="mt-4 text-sm uppercase font-extrabold">
      {date && <ArticleDate date={date} className="font-semibold" />}

      {links?.map(({ title, uri }) => (
        <Fragment key={uri}>
          &nbsp;&bull;&nbsp;
          <Link href={uri}>{title}</Link>
        </Fragment>
      ))}
    </Container>
  );
};

export default HeroDetails;
