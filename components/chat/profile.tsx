import Image from 'next/image';

const picsum = 'https://picsum.photos/1200?random=';

export default function Profile() {
  return (
    <div>
      <div className="flex flex-row items-center gap-4 hover:myhover">
        <div className="relative border-2 border-neutral-600 rounded-full w-8 h-8 overflow-hidden object-cover">
          <Image
            width={100}
            height={100}
            src={`https://picsum.photos/400?random=${Math.random()}`}
            alt="user-profile"
            draggable={false}
          />
        </div>
        <div>TestUser</div>
      </div>
    </div>
  );
}
