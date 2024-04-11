import { createComment, getComment } from '@/lib/actions/post';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { PostContext } from './post-context';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CommentForm() {
  const { states, actions } = useContext(PostContext);
  const { data: session } = useSession();
  const router = useRouter();

  async function submitHandler(event: FormEvent<HTMLButtonElement>): Promise<void> {
    event.preventDefault();
    if (!session?.user?.username) {
      router.push('/login');
      return;
    }

    await createComment({
      postId: states.post.id,
      username: session.user.username,
      content: states.addComment,
    });
    actions.setOpenComment(true);
    actions.setAddComment('');
    actions.setOffset(0);

    const data = await getComment({ postId: states.post.id, offset: 0 });
    actions.setComments(data);
  }

  function textChangeHandler(event: ChangeEvent<HTMLTextAreaElement>): void {
    actions.setAddComment(event.target.value);
  }

  return (
    <form className="mb-6 pl-2">
      <div className="flex flex-row gap-0 items-center">
        <div className="grow py-2 px-2 bg-white rounded-lg rounded-t-lg border border-gray-200">
          <label htmlFor="comment" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment"
            rows={1}
            className="w-full px-0 text-sm align-middle text-gray-900 border-0 focus:ring-0 focus:outline-none"
            placeholder="댓글 달기..."
            onChange={textChangeHandler}
            value={states.addComment}
            required
          ></textarea>
        </div>
        <div className="w-10 h-10 hover:myhover">
          <button
            type="submit"
            onClick={submitHandler}
            className="w-full h-full flex items-center justify-center py-2.5 text-sm font-bold text-center"
          >
            <PaperAirplaneIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </form>
  );
}
