import React from 'react';

type TimeProps = {
  date: string,
  className?: string,
};

const ArticleDate: React.FC<TimeProps> = ({ date, className }) => {
  const dateObject = new Date(date);

  return (
    <time dateTime={ dateObject.toISOString() } className={ `uppercase ${className || ''}` }>
      { dateObject.toLocaleDateString(undefined, { dateStyle: 'medium' }) }
    </time>
  );
};

export default ArticleDate;
