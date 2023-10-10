import Link, { LinkProps } from 'next/link';
import React, { PropsWithChildren } from 'react';

type ArticleMetaProps = PropsWithChildren<{
  title?: string;
  links?: { uri: string; title: string }[];
  linkProps?: Omit<LinkProps, 'href'>;
  className?: string;
  inlineLinks?: boolean;
}>;

const ArticleMeta: React.FC<ArticleMetaProps> = ({
  title,
  linkProps = {},
  links,
  className,
  inlineLinks = true,
  children,
}) => {
  if (!children && !links?.length) {
    return null;
  }

  return (
    <div className={`pb-6 mb-6 border-b ${className || ''}`}>
      {title && (
        <h2 className="text-slate-500 font-semibold mb-6 uppercase tracking-wide">
          {title}
        </h2>
      )}

      {children}

      {links && (
        <ul className={`content-links ${inlineLinks ? 'flex flex-wrap' : ''}`}>
          {links.map((link, i) => (
            <li
              key={`${title}-${i}-${link.uri}-${link.title}`}
              className={`${inlineLinks ? 'mr-3' : 'mb-2'}`}
            >
              <Link {...linkProps} href={link.uri}>
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ArticleMeta;
