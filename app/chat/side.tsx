import { ChatType, UserProfileType } from '@/types/definitions';
import { getUsername } from '@/lib/utils';
import { auth } from 'auth';
import Image from 'next/image';
import Link from 'next/link';
import { UserCircleIcon } from '@heroicons/react/24/solid';

export default function ChatSideBarServer({ chatList }: { chatList: ChatType[] }) {
  return (
    <div className="w-full shrink-0 border-b h-24 px-4 flex flex-row items-center overflow-x-scroll">
      {chatList && chatList.map((c, i) => <SideChatRoom key={i} chat={c} />)}
    </div>
  );
}

async function SideChatRoom({ chat }: { chat: ChatType }) {
  const session = await auth();
  const username = getUsername(session);
  const users = chat?.users;

  // TODO
  if (users?.length === 1) {
  }

  return (
    <Link href={`/chat/${chat.id}`} className="flex flex-col hover:myhover">
      {users && users.filter((u) => u.username !== username).map((u, i) => <Profile key={i} profile={u} />)}
    </Link>
  );
}

function Profile({ profile }: { profile: UserProfileType }) {
  const profileFile = profile.files && profile.files[0];
  console.log(profileFile);
  return (
    <div>
      <div className="flex flex-col items-center gap-2 px-2">
        {profileFile ? (
          <div className="relative ring-2 ring-black flex items-center justify-center w-8 h-8 rounded-full overflow-hidden">
            <Image width={200} height={200} alt="user-profile" src={profileFile?.url.sm} draggable={false} />
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 rounded-full">
            <UserCircleIcon className="w-8 text-neutral-300" />
          </div>
        )}
        <p className="text-xs font-bold">{profile.username}</p>
      </div>
    </div>
  );
}
