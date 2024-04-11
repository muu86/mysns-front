import { PropsWithChildren } from 'react';

export default function Container({ children }: PropsWithChildren) {
  return <div className="w-full grow flex flex-col overflow-hidden">{children}</div>;
}
