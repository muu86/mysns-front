import CreatePostForm from '@/components/post/create-post-form';

export default function Post() {
  return (
    <main className="w-full h-full sm:h-4/5 sm:mt-20 flex flex-col items-center overflow-y-scroll">
      <div className="w-full mx-auto px-2 sm:my-4 sm:px-3 border rounded-md flex flex-col items-center">
        <CreatePostForm />
      </div>
    </main>
  );
}
