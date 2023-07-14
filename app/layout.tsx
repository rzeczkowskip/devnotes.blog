import './globals.css';
import './syntax.css';
import { Mulish } from 'next/font/google';
import React from 'react';
import container from '../config/container';
import Analytics from '@/components/Analytics/Analytics';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Site } from '@/types/SiteConfig';

const mulish = Mulish({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  preload: true,
});

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { title, nav, locale } = container.get<Site>('params.site_config');

  return (
    <html lang={locale}>
      <body className={`${mulish.className} bg-slate-50 text-slate-900`}>
        <Header title={title} nav={nav} />
        {children}
        <Footer />

        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;
