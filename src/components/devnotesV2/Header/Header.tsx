import Link from 'next/link';
import React from 'react';
import Nav from './Nav';
import Container from '@/components/devnotesV2/Container';
import useTranslation from '@/hooks/useTranslation';
import { Site } from '@/types/SiteConfig';
import Logo from '@assets/logo.svg';

type HeaderProps = {
  title: string;
  nav: Site['nav'];
};

const Header: React.FC<HeaderProps> = ({ title, nav }) => {
  const { t } = useTranslation();

  return (
    <header className="py-3">
      <Container>
        <div className="flex items-center">
          <Link
            href="/"
            title={title}
            className="flex h-full items-center text-black no-underline"
          >
            <Logo className="mr-3 h-12 w-auto" />
            <span className="text-xl font-extrabold">{title}</span>
          </Link>

          <div className="ml-auto mr-0 lg:ml-4 lg:mr-auto">
            {nav && <Nav items={nav} toggleAriaLabel={t('nav_toggle_label')} />}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
