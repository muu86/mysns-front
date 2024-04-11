'use server';

import { GetCommentPayload, GetPostPayload, GetPostResult } from '@/types/api-definition';
import { CommentType, PostType } from '@/types/definitions';
import { auth } from 'auth';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { stringify } from 'querystring';
import { calculateDate } from '../utils';

export async function createPost({ content, fileKeys }: { content: string; fileKeys: string[] }) {
  const session = await auth();
  if (!session?.user?.username) {
    console.log('인증되지 않은 사용자 접근');
    redirect('/login');
  }

  const body = {
    username: session.user.username,
    content: content,
    files: fileKeys,
  };

  const response = await fetch(`${process.env.SERVER_BASE_URL}/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  console.log(response);

  revalidatePath('/');
  redirect('/');
}

export async function getPost({
  username,
  latitude,
  longitude,
  offset = 0,
}: {
  username?: string;
  latitude?: number;
  longitude?: number;
  offset?: number;
}) {
  const param: GetPostPayload = {
    username,
    latitude,
    longitude,
    offset,
  };

  const response = await fetch(`${process.env.SERVER_BASE_URL}/post?${stringify(param)}`, {
    method: 'GET',
    next: {
      tags: ['getPost'],
    },
  });
  const data: GetPostResult[] = await response.json();

  return data.map((d) => {
    if (d.comments) {
      d.comments.forEach((c) => {
        c.createdAt = calculateDate(c.createdAt);
        c.modifiedAt = c.modifiedAt && calculateDate(c.modifiedAt);
      });
    }
    d.createdAt = calculateDate(d.createdAt);
    d.modifiedAt = d.modifiedAt && calculateDate(d.modifiedAt);
    return d;
  }) as PostType[];
}

export async function getUserPost({ username, offset = 0 }: { username?: string; offset?: number }) {
  const param: GetPostPayload = {
    username,
    offset,
  };

  const response = await fetch(`${process.env.SERVER_BASE_URL}/post/${username}`, {
    method: 'GET',
    // cache: 'force-cache',
    next: {
      tags: ['getPost'],
    },
  });
  const data: GetPostResult[] = await response.json();

  return data.map((d) => {
    d.createdAt = calculateDate(d.createdAt);
    d.modifiedAt = d.modifiedAt && calculateDate(d.modifiedAt);
    return d;
  }) as PostType[];
}

export async function createComment({
  postId,
  username,
  content,
}: {
  postId?: number;
  username?: string;
  content?: string;
}) {
  const response = await fetch(`${process.env.SERVER_BASE_URL}/post/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      postId,
      username,
      content,
    }),
  });

  if (response.status !== 200) {
    // ...
  }

  revalidateTag('getComment');
}

export async function getComment({ postId, offset }: { postId: number; offset?: number }): Promise<CommentType[]> {
  const param: GetCommentPayload = {
    postId,
    offset,
  };

  const response = await fetch(`${process.env.SERVER_BASE_URL}/post/comment?${stringify(param)}`, {
    next: {
      tags: ['getComment'],
    },
  });

  if (response.status !== 200) {
    //
  }

  const data: any[] = await response.json();

  return data.map((d) => {
    d.createdAt = calculateDate(d.createdAt);
    d.modifiedAt = d.modifiedAt && calculateDate(d.modifiedAt);
    return d;
  }) as CommentType[];
}
