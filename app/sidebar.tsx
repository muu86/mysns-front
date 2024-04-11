import SignoutButton from '@/components/sidebar/signout-button';
import { cn } from '@/lib/utils';
import { ChatBubbleLeftIcon, HomeIcon, PlusCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { auth } from 'auth';
import Link from 'next/link';

export default async function Sidebar() {
  const session = await auth();

  const menus = [
    {
      name: '홈',
      row: 'row-start-2',
      icon: HomeIcon,
      link: '/',
    },
    {
      name: '메시지',
      row: 'row-start-3',
      icon: ChatBubbleLeftIcon,
      link: '/chat',
    },
    {
      name: '포스트',
      row: 'row-start-4',
      icon: PlusCircleIcon,
      link: `/post/${session?.user?.username}/n`,
    },
    {
      name: '프로필',
      row: 'row-start-5',
      icon: UserIcon,
      link: `/user/${session?.user?.username}/m`,
    },
  ];

  return (
    <nav className="fixed bottom-0 shrink-0 z-20 bg-white w-full border-t sm:border-r h-12 sm:w-20 md:w-24 sm:min-h-screen">
      <div className="w-full h-full">
        <div className="min-h-full w-full flex flex-row justify-center items-center sm:grid sm:grid-cols-1 sm:grid-rows-12 sm:place-items-center">
          {menus.map((menu, i) => (
            <Button key={i} row={menu.row} name={menu.name} Icon={menu.icon} link={menu.link} />
          ))}

          <div className="row-start-11 w-full">
            <SignoutButton />
          </div>
        </div>
      </div>
    </nav>
  );
}

function Button({
  name,
  row,
  Icon,
  link,
}: {
  name: string;
  row: string;
  Icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  link: string;
}) {
  return (
    <div className={cn(row, 'w-full')}>
      <Link
        href={link}
        className="w-full h-full flex flex-row justify-center items-center gap-1 px-6 py-2 hover:myhover"
      >
        <Icon className="w-7 text-neutral-600" />
        {/* <div className="text-sm font-extralight hidden sm:block">
          <span>{name}</span>
        </div> */}
      </Link>
    </div>
  );
}
