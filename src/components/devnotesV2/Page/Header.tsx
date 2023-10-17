import React from 'react';
import ArticleDate from '@/components/devnotesV2/ArticleDate';
import ColoredText from '@/components/devnotesV2/ColoredText';
import cn from '@/helpers/cn';
import useTranslation from '@/hooks/useTranslation';

type HeaderProps = {
  title: string;
  subtitle?: string;
  date?: string;
};

const Header: React.FC<HeaderProps> = ({ title, subtitle, date }) => {
  const { locale } = useTranslation();

  return (
    <header className="prose prose-sm md:prose mb-6 border-b">
      <h1 className={cn('mt-0 mb-6')}>
        <ColoredText>{title}</ColoredText>
      </h1>

      {(subtitle || date) && (
        <div className="prose-container">
          {subtitle && <p>{subtitle}</p>}

          {date && (
            <p>
              <ArticleDate
                date={date}
                className={cn('text-muted')}
                locale={locale}
              />
            </p>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
