import { auth } from 'auth';
import { getUserProfile } from '../../../lib/actions/user';
import { ChatBubbleLeftRightIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Post from '@/components/post/post';
import { getUserPost } from '@/lib/actions/post';
import { SessionProvider } from 'next-auth/react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { Separator } from '@/components/ui/separator';

export default async function Page({ params }: { params: { username: string } }) {
  const username = decodeURIComponent(params.username);
  const user = await getUserProfile(username);
  if (!user) {
    redirect('/');
  }

  const userFile = user.files && user.files[0];

  const session = await auth();
  const isOwner = session?.user?.username === username;

  const userPosts = await getUserPost({ username, offset: 0 });

  return (
    <SessionProvider session={session}>
      <main className="border rounded-lg">
        <div className="w-full h-6 my-2 flex flex-row justify-end px-4">
          {isOwner && (
            <Link
              href={`/user/${session.user!.username}/m`}
              className="w-6 h-full flex items-center justify-center hover:myhover"
            >
              {/* 수정 버튼 */}
              <PencilSquareIcon />
            </Link>
          )}
        </div>
        <div className="w-full rounded-lg flex flex-col min-w-0 break-words bg-white">
          <div className="px-6">
            <div className="flex flex-col justify-center">
              <div className="w-full px-4 flex justify-center">
                <div className="w-full h-full flex flex-col items-center">
                  {userFile ? (
                    <div className="relative w-40 h-40 ring-1 ring-black rounded-full flex items-center justify-center overflow-hidden">
                      <Image
                        alt="profile-image"
                        width={600}
                        height={600}
                        src={`${userFile.url.md}`}
                        className="shadow-lg border-none object-center object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-40 h-40 rounded-full">
                      <UserCircleIcon className="w-40 text-neutral-300" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-10">
              <Link
                href={`/newchat/${username}`}
                className="flex flex-col gap-2 items-center justify-center hover:myhover"
              >
                <ChatBubbleLeftRightIcon className="w-6" />
                <span className="text-xs">메시지</span>
              </Link>
            </div>
            <div className="text-center mt-12">
              <h3 className="text-xl font-semibold leading-normal mb-2">{user?.username}</h3>
              <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
                {user?.babyMonths && `${user.babyMonths} 개월 아기`}
              </div>
              <div className="mb-2 mt-10 w-full flex flex-col justify-center items-center gap-4"></div>
            </div>
            <div className="mt-10 py-10 border-t text-center">
              <div className="flex flex-wrap justify-center">
                <div className="w-full lg:w-9/12 px-4">{user?.content}</div>
              </div>
            </div>
          </div>
        </div>
        <Separator />
        <Post firstPosts={userPosts} />
        <div className="h-20"></div>
      </main>
    </SessionProvider>
  );
}
