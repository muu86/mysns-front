import ChatContextProvider from '@/components/chat/chat-context';
import { getChat } from '@/lib/actions/chat';
import { getUsername } from '@/lib/utils';
import { auth } from 'auth';
import { ReactNode } from 'react';
import ChatSideBarServer from './side';

export default async function Layout({ room }: { room: ReactNode }) {
  const session = await auth();

  const username = getUsername(session);
  const chatList = await getChat(username);
  return (
    <div className="w-full h-full sm:h-4/5 sm:mt-20 border sm:rounded-lg flex flex-col">
      <ChatContextProvider chatList={chatList}>
        <ChatSideBarServer chatList={chatList} />
        {room}
      </ChatContextProvider>
    </div>
  );
}
