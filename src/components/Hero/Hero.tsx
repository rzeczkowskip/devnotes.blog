import React from 'react';
import HeroDetails from './HeroDetails';
import { HeroProps } from './types';
import Container from '@/components/Container';

const Hero: React.FC<HeroProps> = ({
  title, subtitle, date, links,
}) => (
  <Container className="py-14 md:py-20 lg:py-28 text-center flex flex-col items-center">
    <h1 className="
      font-extrabold tracking-wide
      bg-clip-text text-fill-transparent
      bg-gradient-to-r from-lead-800 to-lead-500
      text-3xl md:text-4xl lg:text-6xl
      leading-tight md:leading-tight lg:leading-tight
      text-lead-800
    ">{ title }</h1>

    { subtitle && (<h2 className="text-lg leading-normal mt-4">{ subtitle }</h2>) }

    <HeroDetails date={ date } links={ links } />
  </Container>
);

export default Hero;
