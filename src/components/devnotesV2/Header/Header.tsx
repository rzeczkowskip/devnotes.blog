import React from 'react';
import Nav from './Nav';
import Container from '@/components/devnotesV2/Container';
import Logo from '@/components/devnotesV2/Header/Logo';
import useTranslation from '@/hooks/useTranslation';
import { Site } from '@/types/SiteConfig';

type HeaderProps = {
  title: string;
  nav: Site['nav'];
};

const Header: React.FC<HeaderProps> = ({ title, nav }) => {
  const { t } = useTranslation();

  return (
    <Container>
      <header className="py-4 border-b-2 border-dashed">
        <div className="flex items-center">
          <Logo
            title={title}
            href="/"
            className="h-12 text-2xl font-semibold"
          />
          <div className="ml-auto mr-0">
            {nav && <Nav items={nav} toggleAriaLabel={t('nav_toggle_label')} />}
          </div>
        </div>
      </header>
    </Container>
  );
};

export default Header;
