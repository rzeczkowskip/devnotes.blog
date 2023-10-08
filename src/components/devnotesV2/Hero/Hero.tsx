import React from 'react';
import HeroDetails from './HeroDetails';
import { HeroProps } from './types';
import ColoredTitle from '@/components/devnotesV2/ColoredTitle';
import Container from '@/components/devnotesV2/Container';

const Hero: React.FC<HeroProps> = ({ title, subtitle, date, links }) => (
  <Container className="py-14 md:py-20 lg:py-28 text-center flex flex-col items-center">
    <ColoredTitle as="h1" size="big">
      {title}
    </ColoredTitle>

    {subtitle && <h2 className="text-lg leading-normal mt-4">{subtitle}</h2>}

    <HeroDetails date={date} links={links} />
  </Container>
);

export default Hero;
