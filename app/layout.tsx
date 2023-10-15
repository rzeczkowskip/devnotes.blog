import './globals.css';
import './syntax.css';
import { Bitter } from 'next/font/google';
import React from 'react';
import container from '../config/container';
import CloudflareAnalytics from '@/components/devnotesV2/Analytics/CloudflareAnalytics';
import Footer from '@/components/devnotesV2/Footer/Footer';
import Header from '@/components/devnotesV2/Header/Header';
import TailwindDebug from '@/components/devnotesV2/TailwindDebug';
import cn from '@/helpers/cn';
import { Site } from '@/types/SiteConfig';

const font = Bitter({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  preload: true,
});

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const { title, nav, locale, params } =
    container.get<Site>('params.site_config');
  const isProd = container.get('params.is_prod');
  const isDev = container.get('params.app_env') === 'dev';

  return (
    <html lang={locale}>
      <body className={cn(font.className, 'text-slate-900')}>
        {isDev && <TailwindDebug />}
        <Header title={title} nav={nav} />

        <main className="mt-10">{children}</main>

        <Footer title={title} href="/" />
        <CloudflareAnalytics token={params?.cfAnalyticsId} isProd={isProd} />
      </body>
    </html>
  );
};

export default RootLayout;
