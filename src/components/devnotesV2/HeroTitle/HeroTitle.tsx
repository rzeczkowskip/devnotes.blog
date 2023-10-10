import React from 'react';
import ArticleDate from '@/components/devnotesV2/ArticleDate';
import ColoredText from '@/components/devnotesV2/ColoredText';

const clampHeadingLevel = (level: number) => Math.min(Math.max(level, 1), 6);

export type HeroTitleProps = {
  title: string;
  subtitle?: string;
  className?: string;
  headingLevel?: number;
  date?: string;
};

const HeroTitle: React.FC<HeroTitleProps> = ({
  title,
  subtitle,
  date,
  className,
  headingLevel = 1,
}) => {
  const isHeading = headingLevel !== 0;

  const Title = isHeading
    ? (`h${clampHeadingLevel(headingLevel)}` as 'h1')
    : 'div';

  const Subtitle = isHeading
    ? (`h${clampHeadingLevel(headingLevel + 1)}` as 'h1')
    : 'div';

  return (
    <div className={`${className || ''} border-b pb-4`}>
      {date && (
        <div className="text-sm uppercase text-slate-500 mb-2">
          {date && <ArticleDate date={date} className="font-semibold" />}
        </div>
      )}

      <Title className="text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
        <ColoredText>{title}</ColoredText>
      </Title>

      {subtitle && (
        <Subtitle className="text-lg leading-normal mt-4">{subtitle}</Subtitle>
      )}
    </div>
  );
};

export default HeroTitle;
