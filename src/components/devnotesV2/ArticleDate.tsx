import React from 'react';

type TimeProps = {
  date: string;
  className?: string;
  locale?: string;
};

const ArticleDate: React.FC<TimeProps> = ({ date, className, locale }) => {
  const dateObject = new Date(date);

  return (
    <time dateTime={dateObject.toISOString()} className={className}>
      {dateObject.toLocaleDateString(locale, { dateStyle: 'long' })}
    </time>
  );
};

export default ArticleDate;
