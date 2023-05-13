import './globals.css';
import { Mulish } from 'next/font/google';

const mulish = Mulish({
  subsets: ['latin'],
  weight: 'variable',
  display: 'swap',
  preload: true,
});

const RootLayout = async ({
  children,
}: {
  children: React.ReactNode
}) => (
    <html lang="en">
      <body className={mulish.className}>
        {children}
      </body>
    </html>
);

export default RootLayout;
