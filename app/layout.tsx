import { cn } from '@/lib/utils';
import './globals.css';
import Sidebar from '@/app/sidebar';

import { Nanum_Gothic as FontSans } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { auth } from 'auth';

const fontSans = FontSans({
  subsets: ['latin'],
  weight: ['400', '700', '800'],
  variable: '--font-sans',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={cn('font-sans', fontSans.variable)}>
        <SessionProvider session={session}>
          <div className="w-full h-svh flex flex-col-reverse sm:flex-row">
            <Sidebar />
            <div style={{ height: 'calc(100% - 48px)' }} className="w-full mb-auto ml-0 sm:ml-20 md:ml-24">
              <div className="w-full h-full grow sm:grow-0 sm:w-[470px] mx-auto flex flex-col">{children}</div>
            </div>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
