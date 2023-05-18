import './globals.css';
import { Mulish } from 'next/font/google';
import React from 'react';
import container from '../config/container';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Site } from '@/types/SiteConfig';

const mulish = Mulish({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  preload: true,
});

const RootLayout = async ({
  children,
}: {
  children: React.ReactNode,
}) => {
  const { title, nav } = container.get<Site>('params.site_config');

  return (
    <html lang="en">
    <body className={ `${mulish.className} bg-neutral-50 text-neutral-900` }>
      <Header title={ title } nav={ nav } />
        {children}
      <Footer />
    </body>
    </html>
  );
};

export default RootLayout;
