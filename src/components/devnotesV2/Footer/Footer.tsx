import Link from 'next/link';
import React from 'react';
import Container from '@/components/devnotesV2/Container';

type FooterProps = {
  title: string;
  href?: string;
};

const Footer: React.FC<FooterProps> = ({ title, href = '#' }) => (
  <footer className="py-8 text-center content-links">
    <Container>
      <p>
        Copyright &copy; <Link href={href}>{title}</Link>
      </p>
    </Container>
  </footer>
);

export default Footer;
