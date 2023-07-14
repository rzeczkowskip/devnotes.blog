import Link from 'next/link';
import React from 'react';
import container from '../../../config/container';
import Container from '@/components/Container';
import { Site } from '@/types/SiteConfig';

const Footer: React.FC = () => {
  const { title } = container.get<Site>('params.site_config');

  return (
    <footer className="py-7 text-center content-links">
      <Container>
        <p>
          Copyright &copy; <Link href="/">{title}</Link>
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
