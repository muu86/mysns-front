'use client';

import { ChangeEventHandler, useContext } from 'react';
import { UserProfileContext } from './user-profile-context';

export default function ContentEditor() {
  const { states, actions } = useContext(UserProfileContext);

  const contentChangeHandler: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
    actions.setProfile({
      ...states.profile,
      content: event.target.value,
    });
  };

  return (
    <textarea
      className="w-full h-60 p-6 border rounded-lg text-lg leading-relaxed"
      onChange={contentChangeHandler}
      value={states.profile?.content ? states.profile.content : ''}
    />
  );
}
