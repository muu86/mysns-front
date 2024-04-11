import { auth } from '@/app/api/auth/[...nextauth]/auth';
import StartForm from './start-form';
import { redirect } from 'next/navigation';
import { getLegalAddresses } from '@/lib/actions/location';
import { SessionProvider } from 'next-auth/react';

export default async function Start() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  if (session.user?.username) {
    redirect('/');
  }

  const address = await getLegalAddresses();

  return (
    <SessionProvider session={session}>
      <main className="w-full h-full flex flex-col items-center">
        <div className="sm:w-72">
          <div className="text-center"></div>
          <StartForm session={session} address={address} />
        </div>
      </main>
    </SessionProvider>
  );
}
