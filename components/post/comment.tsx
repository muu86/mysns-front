import { getComment } from '@/lib/actions/post';
import { CommentType } from '@/types/definitions';
import {
  ArrowUpCircleIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import { MouseEvent, useContext } from 'react';
import CommentForm from './comment-form';
import { PostContext } from './post-context';
import { UserCircleIcon } from '@heroicons/react/24/solid';

const COMMENT_LIMT = 5;

export default function Comment() {
  const { states, actions } = useContext(PostContext);

  async function openCommentHandler(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();

    if (!states.openComment && states.comments.length == 0) {
      const comments = await getComment({
        postId: states.post.id,
        offset: 0,
      });
      actions.setComments(comments);
      console.log('comments: ', comments);
    }

    actions.setOpenComment(!states.openComment);
  }

  function offsetUpHandler(event: MouseEvent<HTMLButtonElement>): void {
    if (states.offset + COMMENT_LIMT >= states.comments.length) return;
    actions.setOffset(states.offset + COMMENT_LIMT);
  }
  function offsetDownHandler(event: MouseEvent<HTMLButtonElement>): void {
    if (states.offset - COMMENT_LIMT < 0) return;
    actions.setOffset(states.offset - COMMENT_LIMT);
  }

  return (
    <section className="flex items-center justify-center">
      <div className="container">
        <CommentForm />
        <button
          onClick={openCommentHandler}
          className="mr-auto py-1 pl-4 flex items-center gap-2 justify-center hover:myhover"
        >
          {!states.openComment && (
            <>
              <ChatBubbleLeftRightIcon className="w-6 h-6" />
              <span className="text-sm">댓글보기</span>
            </>
          )}
          {states.openComment && (
            <>
              <ArrowUpCircleIcon className="w-6 h-6" />
              <span className="text-sm">닫기</span>
            </>
          )}
        </button>
        {states.openComment && states.comments && (
          <div className="flex-col w-full sm:px-4 sm:pt-4 md:px-4 sm:rounded-lg">
            <div className="mt-2">
              {/* offset 부터 잘라서 */}
              {states.comments
                .filter((c, i) => i >= states.offset && i < states.offset + COMMENT_LIMT)
                .map((c, i) => (
                  <CommentOne key={i} comment={c} />
                ))}
            </div>
            <div className="flex flex-row gap-8 justify-center">
              {/* offset 변경 */}
              <button onClick={offsetDownHandler} className="p-2 hover:myhover">
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              <div className="flex items-center">
                <span>{Math.floor(states.offset / COMMENT_LIMT + 1)}</span>
              </div>
              <button onClick={offsetUpHandler} className="p-2 hover:myhover">
                <ChevronRightIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CommentOne({ comment }: { comment: CommentType }) {
  const imageExists = comment.user.files && comment.user.files.length > 0;
  return (
    <div className="flex flex-row h-16 border-b-2 py-2 last:border-none">
      {imageExists ? (
        <div className="relative shrink-0 ring-1 ring-black flex items-center justify-center w-8 h-8 rounded-full overflow-hidden">
          <Image fill className="object-cover" alt="user-profile" src={comment.user!.files![0].url.sm} />
        </div>
      ) : (
        <div className="flex items-center justify-center w-8 h-8 rounded-full">
          <UserCircleIcon className="w-8 text-neutral-300" />
          {/* <UserCircleIcon className="w-11 text-neutral-300" /> */}
        </div>
      )}
      <div className="flex-col w-full mt-1">
        <div className="flex items-center flex-1 px-4 font-bold leading-tight">
          <div className="flex-1">
            <p className="text-xs">{comment.user.username}</p>
          </div>
          <div className="ml-2 text-xs font-normal text-gray-500">{comment.createdAt}</div>
        </div>
        <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600">{comment.content}</div>
      </div>
    </div>
  );
}
