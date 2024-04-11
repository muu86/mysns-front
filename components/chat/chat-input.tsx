'use client';

import { Input } from '@/components/ui/input';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, KeyboardEvent, MouseEvent, useContext, useRef } from 'react';
import { ChatContext } from './chat-context';

export default function ChatInput() {
  const { states, actions } = useContext(ChatContext);

  const ref = useRef(null);

  function messageChangeHandler(event: ChangeEvent<HTMLInputElement>): void {
    event.preventDefault();
    actions.setCurrentMessage(event.target.value);
  }

  function messageSendHandler(event: MouseEvent<HTMLButtonElement>): void {
    actions.sendMessage();
  }

  function keyDownHandler(event: KeyboardEvent<HTMLInputElement>): void {
    if (event.code === 'Enter' && !event.nativeEvent.isComposing) {
      actions.sendMessage();
    }
  }

  return (
    <div className="w-full p-4 flex flex-col items-center justify-center gap-4">
      <div className="w-full flex flex-row gap-2 items-center">
        <Input ref={ref} value={states.currentMessage} onChange={messageChangeHandler} onKeyDown={keyDownHandler} />
        <button type="button" onClick={messageSendHandler} className="hover:myhover">
          <PaperAirplaneIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}
