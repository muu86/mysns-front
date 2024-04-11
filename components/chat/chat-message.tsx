import { ChatMessageType } from '@/types/definitions';
import { getUsername } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useContext } from 'react';
import { ChatContext } from './chat-context';
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function ChatMessage({ message }: { message: ChatMessageType }) {
  const { states, actions } = useContext(ChatContext);
  const me = getUsername(useSession().data);
  const isMe = me === message.sender;

  const chat = states.chatList.find((c) => c.id == states.selectedChatId);
  const profile = chat?.users.find((u) => u.username === message.sender);
  const isFileExists = profile?.files && profile.files.length > 0;

  return (
    <div
      className={cn('flex flex-row items-center justify-center gap-4', {
        'self-start': isMe,
        'self-end flex-row-reverse': !isMe,
      })}
    >
      <div className="flex flex-col items-center gap-2">
        {isFileExists ? (
          <div
            className={cn(
              'relative shrink-0 ring-2 ring-black rounded-full flex items-center justify-center overflow-hidden object-cover',
              'w-8 h-8'
            )}
          >
            <Image width={200} height={200} src={profile!.files![0].url.sm} alt="user-profile" draggable={false} />
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-full">
            <UserCircleIcon className="w-8 text-neutral-300" />
          </div>
        )}
        <div className="text-xs font-bold">{message.sender}</div>
      </div>
      <div
        className={cn('h-full flex items-center bg-neutral-200 max-w-sm rounded-lg pl-6 pr-6 my-2', {
          'bg-neutral-600 text-white': isMe,
        })}
      >
        {message.message}
        {/* <span className="ml-4 text-xs text-neutral-400 font-light align-bottom">
          {message.createdAt}
        </span> */}
      </div>
    </div>
  );
}
