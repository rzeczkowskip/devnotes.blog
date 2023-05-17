import React from 'react';
import useTranslation from '@/hooks/useTranslation';

type TimeProps = {
  date: string,
  className?: string,
};

const ArticleDate: React.FC<TimeProps> = ({ date, className }) => {
  const dateObject = new Date(date);
  const { locale } = useTranslation();

  return (
    <time dateTime={ dateObject.toISOString() } className={ `uppercase ${className || ''}` }>
      { dateObject.toLocaleDateString(locale, { dateStyle: 'long' }) }
    </time>
  );
};

export default ArticleDate;
