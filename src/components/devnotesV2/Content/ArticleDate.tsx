import React from 'react';
import cn from '@/helpers/cn';
import useTranslation from '@/hooks/useTranslation';

type TimeProps = {
  date: string;
  className?: string;
};

const ArticleDate: React.FC<TimeProps> = ({ date, className }) => {
  const dateObject = new Date(date);
  const { locale } = useTranslation();

  return (
    <time dateTime={dateObject.toISOString()} className={cn('', className)}>
      {dateObject.toLocaleDateString(locale, { dateStyle: 'long' })}
    </time>
  );
};

export default ArticleDate;
