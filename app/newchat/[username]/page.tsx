import { createChat, getChat } from '@/lib/actions/chat';
import { getTargetUsername, getUsername } from '@/lib/utils';
import { auth } from 'auth';
import { revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { username: string } }) {
  const session = await auth();
  const sender = getUsername(session);
  const receiver = getTargetUsername(params.username);
  const foundRoom = await findRoom(sender, receiver);
  if (!foundRoom) {
    const newRoom = await createNewRoom(sender, receiver);

    revalidateTag('getChat');
    redirect(`/chat/${newRoom}`);
  }
  redirect(`/chat/${foundRoom}`);
}

async function findRoom(sender: string, receiver: string): Promise<number | null> {
  const chatList = await getChat(sender);

  for (const c of chatList) {
    if (c.users.length !== 2) {
      continue;
    }

    const a = c.users.find((u) => u.username === sender);
    const b = c.users.find((u) => u.username === receiver);
    if (a && b) {
      return c.id;
    }
  }

  return null;
}

async function createNewRoom(sender: string, receiver: string): Promise<number> {
  const newChat = await createChat(sender, receiver);
  return newChat;
}
