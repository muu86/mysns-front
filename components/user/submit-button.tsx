'use client';

import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { MouseEventHandler, useContext } from 'react';
import Spinner from '../ui/spinner';
import { UserProfileContext } from './user-profile-context';

export default function SubmitButton() {
  const { states, actions } = useContext(UserProfileContext);

  const submitButtonHandler: MouseEventHandler = (event) => {
    actions.submitAction();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col px-4 items-center justify-center hover:myhover hover:cursor-pointer">
        {states.uploading ? (
          <div className="w-8 h-8 flex items-center justify-center">
            <Spinner h={8} />
          </div>
        ) : (
          <button className="w-8 h-8 flex items-center justify-center" onClick={submitButtonHandler}>
            <CheckCircleIcon className="w-10 h-10 self-center" />
          </button>
        )}
        {states.result ? <span className="text-xs">업데이트 성공</span> : <span className="text-xs">저장</span>}
      </div>
    </div>
  );
}
