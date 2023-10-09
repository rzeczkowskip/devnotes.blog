import Link from 'next/link';
import React from 'react';
import Nav from './Nav';
import Container from '@/components/devnotesV2/Container';
import Logo from '@/components/devnotesV2/ui/Logo';
import useTranslation from '@/hooks/useTranslation';
import { Site } from '@/types/SiteConfig';

type HeaderProps = {
  title: string;
  nav: Site['nav'];
};

const Header: React.FC<HeaderProps> = ({ title, nav }) => {
  const { t } = useTranslation();

  return (
    <header className="py-5 border-b-2 border-dotted">
      <Container size="full">
        <div className="flex items-center">
          <Logo
            title={title}
            href="/"
            className="h-16 text-2xl font-extrabold"
          />
          <div className="ml-auto mr-0">
            {nav && <Nav items={nav} toggleAriaLabel={t('nav_toggle_label')} />}
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
