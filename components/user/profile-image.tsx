'use client';

import Image from 'next/image';
import { useContext } from 'react';
import { UserProfileContext } from './user-profile-context';
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function ProfileImage() {
  const { states } = useContext(UserProfileContext);
  const fileExists = states.profile.files && states.profile.files.length > 0;

  return (
    <div className="w-full h-full flex items-center justify-center">
      {fileExists ? (
        <div className="relative ring-2 ring-black w-40 h-40 rounded-full flex items-center justify-center overflow-hidden">
          <Image
            alt="profile-image"
            width={200}
            height={200}
            src={`${states.profile.files![0].url.md}`}
            className="shadow-lg border-none object-center object-cover"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-40 h-40 rounded-full">
          <UserCircleIcon className="w-40 text-neutral-300" />
        </div>
      )}
    </div>
  );
}
