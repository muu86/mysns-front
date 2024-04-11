'use client';

import { getPost } from '@/lib/actions/post';
import { PostType } from '@/types/definitions';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ScrollTrigger } from './ScrollTrigger';
import Comment from './comment';
import PostContextProvider from './post-context';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import FileCarousel from './file-carousel';

export default function Post({ firstPosts }: { firstPosts: PostType[] }) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [offset, setOffset] = useState<number>(0);

  useEffect(() => {
    setPosts([...firstPosts]);
  }, [firstPosts]);

  console.log(posts);

  async function getNextPost() {
    const nextPosts = await getPost({ offset });
    setPosts([...posts, ...nextPosts]);
    setOffset(offset + 10);
  }

  return (
    <>
      {posts.length == 0 && <PostNone />}
      {posts &&
        posts.length > 0 &&
        posts.map((p, i) => (
          <PostContextProvider key={i} post={p}>
            <PostOne key={i} post={p} />
          </PostContextProvider>
        ))}
      <div className="h-12"></div>
      {posts && posts.length > 5 && <ScrollTrigger getNextPost={getNextPost} />}
    </>
  );
}

function PostOne({ post }: { post: PostType }) {
  const { id, user, content, files, address, createdAt } = post;
  const userProfileImageExists = user.files && user.files.length > 0;
  const postImageExists = files && files.length > 0;

  return (
    <article className="w-full mx-auto pb-4 border-b-2 border-dashed flex flex-col border-neutral-200 rounded-md">
      <div className="w-full min-h-16 flex flex-row items-center gap-2 px-2">
        {/* 프로필 */}
        <Link href={`/user/${user.username}`} className="flex flex-row items-center gap-4 p-2 hover:myhover">
          {userProfileImageExists ? (
            <div className="relative ring-2 ring-black flex items-center justify-center w-11 h-11 rounded-full overflow-hidden">
              <Image fill alt="user-profile" className="object-cover" src={user.files![0].url.sm} />
            </div>
          ) : (
            <UserCircleIcon className="w-11 text-neutral-300" />
          )}
          <p className="font-bold">{user.username}</p>
        </Link>
        <div className="flex-1"></div>
        <p className={clsx('font-bold text-sm text-neutral-400')}>
          {address?.gungu} {address?.eupmyundong}
        </p>
        <div className={clsx('text-sm text-neutral-300')}>
          <p>{createdAt}</p>
        </div>
      </div>
      {postImageExists && (
        <div className="relative w-full min-h-64 overflow-hidden object-cover">
          <FileCarousel files={files} />
        </div>
      )}
      <div className="flex-1 mb-6 px-4">
        <p className="pt-6 pb-2">{content}</p>
      </div>
      <div className="">
        <Comment />
      </div>
    </article>
  );
}

function PostNone() {
  return (
    <div className="w-full h-full grow flex items-center justify-center">
      <span>아직 포스트가 없어요</span>
    </div>
  );
}
