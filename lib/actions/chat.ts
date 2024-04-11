'use server';

import { calculateDate } from '@/lib/utils';
import { GetChatMessagePayload } from '@/types/api-definition';
import { ChatMessageType, ChatType } from '@/types/definitions';
import { stringify } from 'querystring';

export async function createChat(sender: string, receiver: string) {
  // console.log('createChat action called');
  const body = { sender, receiver };
  // console.log(body);
  const response = await fetch(`${process.env.SERVER_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (response.status !== 200) {
    return '';
  }

  const data = await response.json();

  return data;
}

export async function getChat(username: string): Promise<ChatType[]> {
  const param = { username };
  const response = await fetch(`${process.env.SERVER_BASE_URL}/chat?${stringify(param)}`, {
    cache: 'force-cache',
    next: {
      tags: ['getChat'],
    },
  });

  if (response.status !== 200) {
    return [];
  }

  const data = await response.json();

  return data;
}

export async function getChatMessage(chatId: number, page = 0, size = 20): Promise<ChatMessageType[]> {
  const param: GetChatMessagePayload = {
    chatId,
    page,
    size,
  };
  const response = await fetch(`${process.env.SERVER_BASE_URL}/chat/message?${stringify(param)}`);
  if (response.status !== 200) {
    console.log(response.status);
    return [];
  }
  const data: any[] = await response.json();
  console.log(data);
  data.map((d) => {
    d.createdAt = calculateDate(d.createdAt);
  });
  return data;
}
