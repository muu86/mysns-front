'use client';

import { useContext, useEffect } from 'react';
import { ChatContext } from './chat-context';
import ChatMessage from './chat-message';

export default function ChatMessageContainer({ id }: { id: number }) {
  const { states, actions } = useContext(ChatContext);

  useEffect(() => {
    actions.setSelectedChatId(id);
  }, [id, actions]);

  return (
    <>
      <main className="w-full py-6 px-6 h-full flex flex-col-reverse gap-6 overflow-y-scroll">
        {states.messages && states.messages.map((m, i) => <ChatMessage key={i} message={m} />)}
      </main>
    </>
  );
}
