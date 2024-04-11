'use client';

import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

export default function SignoutButton() {
  return (
    <button
      className="w-full h-full flex flex-row justify-center items-center gap-1 px-6 py-2 hover:myhover"
      onClick={() => signOut()}
    >
      <ArrowRightStartOnRectangleIcon className="w-7 text-neutral-600" />
    </button>
  );
}
