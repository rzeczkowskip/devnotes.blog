import React, { PropsWithChildren } from 'react';

type SectionProps = PropsWithChildren<{
  background?: 'white' | 'gray',
  paddingY?: 'bottom' | 'both',
  as?: 'article' | 'section',
}>;

const Section: React.FC<SectionProps> = ({
  children,
  background,
  paddingY = 'both',
  as: SectionTag = 'section',
}) => (
    <SectionTag className={ `
      ${!paddingY || paddingY === 'both' ? 'py-20' : ''}
      ${paddingY === 'bottom' ? 'pb-20' : ''}
      
      ${background === 'white' ? 'bg-white' : ''} 
      ${background === 'gray' ? 'bg-slate-100 border-y border-slate-200' : ''}
    ` }>
        { children }
    </SectionTag>
);

export default Section;
