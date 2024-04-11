import Post from '@/components/post/post';
import { getPost } from '@/lib/actions/post';
import { auth } from 'auth';

export default async function Home() {
  const session = await auth();
  const param = {
    username: session?.user?.username || '',
    offset: 0,
  };
  const posts = await getPost(param);
  return (
    <main className="w-full h-full grow">
      <Post firstPosts={posts} />
    </main>
  );
}
