'use client';

import { createComment } from '@/lib/actions/post';
import { CommentType, PostType } from '@/types/definitions';
import { useSession } from 'next-auth/react';
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from 'react';

export default function PostContextProvider({ post, children }: PropsWithChildren<{ post: PostType }>) {
  const { data: session } = useSession();

  const [addComment, setAddComment] = useState<string | undefined>();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [openComment, setOpenComment] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);

  function addCommentSubmit({ postId }: { postId: number }) {
    createComment({
      postId,
      username: session?.user?.username,
      content: addComment,
    });
  }

  const value = {
    states: {
      post,
      addComment,
      comments,
      openComment,
      offset,
    },
    actions: {
      setAddComment,
      addCommentSubmit,
      setComments,
      setOpenComment,
      setOffset,
    },
  };

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>;
}

export const PostContext = createContext<PostContextType>({} as PostContextType);

export type PostContextState = {
  post: PostType;
  addComment: string | undefined;
  comments: CommentType[];
  openComment: boolean;
  offset: number;
};

export type PostContextActions = {
  setAddComment: Dispatch<SetStateAction<string | undefined>>;
  addCommentSubmit: ({ postId }: { postId: number }) => void;
  setComments: Dispatch<SetStateAction<CommentType[]>>;
  setOpenComment: Dispatch<SetStateAction<boolean>>;
  setOffset: Dispatch<SetStateAction<number>>;
};

export type PostContextType = {
  states: PostContextState;
  actions: PostContextActions;
};
