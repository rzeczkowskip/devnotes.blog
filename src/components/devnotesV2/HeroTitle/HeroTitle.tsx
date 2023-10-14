import Link from 'next/link';
import React from 'react';
import ArticleDate from '@/components/devnotesV2/ArticleDate';
import ColoredText from '@/components/devnotesV2/ColoredText';

const clampHeadingLevel = (level: number) => Math.min(Math.max(level, 1), 6);

export enum HeroTitleSize {
  Regular = 'regular',
  Small = 'small',
}

export type HeroTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  headingLevel?: number;
  size?: HeroTitleSize;
  date?: string;
  href?: string;
};

const HeroTitle: React.FC<HeroTitleProps> = ({
  title,
  subtitle,
  date,
  className,
  headingLevel = 1,
  size = HeroTitleSize.Regular,
  href,
}) => {
  const isHeading = headingLevel !== 0;

  const Title = isHeading
    ? (`h${clampHeadingLevel(headingLevel)}` as 'h1')
    : 'div';

  const Subtitle = isHeading
    ? (`h${clampHeadingLevel(headingLevel + 1)}` as 'h1')
    : 'div';

  const titleChild = <ColoredText>{title}</ColoredText>;

  return (
    <div className={className}>
      {date && (
        <div className="text-sm uppercase text-muted mb-2">
          {date && <ArticleDate date={date} className="font-semibold" />}
        </div>
      )}

      <Title
        className={`font-bold leading-tight my-0 
          ${size === HeroTitleSize.Regular ? 'text-3xl sm:text-4xl' : ''}
          ${size === HeroTitleSize.Small ? 'text-2xl sm:text-3xl' : ''}
        `}
      >
        {href ? (
          <Link
            className="content-link-reverse font-bold no-underline"
            title={title}
            href={href}
          >
            {titleChild}
          </Link>
        ) : (
          titleChild
        )}
      </Title>

      {subtitle && (
        <Subtitle className="text-lg leading-normal mt-4">{subtitle}</Subtitle>
      )}
    </div>
  );
};

export default HeroTitle;
