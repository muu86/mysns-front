'use client';

import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, useContext } from 'react';
import { UserProfileContext } from './user-profile-context';

export default function ModifyFile() {
  const { states, actions } = useContext(UserProfileContext);

  function fileInputHandler(event: ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;
    actions.fileUploadHandler(event.target.files[0]);
  }

  return (
    <div className="absolute right-1 h-full flex items-center justify-center text-neutral-400">
      <div className="w-10 h-10 flex items-center justify-center">
        <label className="w-full flex flex-col justify-center items-center text-center hover:myhover">
          <PencilSquareIcon className="w-8 h-8" />
          <input className="hidden" type="file" accept="image/**" name="files" onChange={fileInputHandler} />
          <span className="text-xs">이미지 수정</span>
        </label>
      </div>
    </div>
  );
}
