'use client';

import { signIn } from 'next-auth/react';

export default function Login() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-72 border rounded-md flex-col items-center justify-center">
        <div className="py-3 text-center">
          <p className="font-bold">로그인</p>
        </div>
        <div className="py-3 text-center hover:myhover">
          <button onClick={() => signIn('keycloak', { callbackUrl: '/login/start' })}>Keycloak</button>
        </div>
      </div>
    </main>
  );
}
