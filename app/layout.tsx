import './globals.css';
import './syntax.css';
import { Mulish } from 'next/font/google';
import React from 'react';
import container from '../config/container';
import CloudflareAnalytics from '@/components/devnotesV2/Analytics/CloudflareAnalytics';
import Footer from '@/components/devnotesV2/Footer/Footer';
import Header from '@/components/devnotesV2/Header/Header';
import { Site } from '@/types/SiteConfig';

const mulish = Mulish({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  preload: true,
});

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { title, nav, locale, params } =
    container.get<Site>('params.site_config');
  const isProd = container.get('params.is_prod');

  return (
    <html lang={locale}>
      <body className={`${mulish.className} bg-slate-50 text-slate-900`}>
        <Header title={title} nav={nav} />

        {children}

        <Footer title={title} href="/" />
        <CloudflareAnalytics token={params?.cfAnalyticsId} isProd={isProd} />
      </body>
    </html>
  );
};

export default RootLayout;
