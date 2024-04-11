'use client';

import { ChatMessageType, ChatType } from '@/types/definitions';
import { getChatMessage } from '@/lib/actions/chat';
import { getUsername } from '@/lib/utils';
import { Client, IMessage } from '@stomp/stompjs';
import { useSession } from 'next-auth/react';
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useCallback, useEffect, useState } from 'react';

type ChatContextProps = {
  chatList: ChatType[];
};

export type ChatRoomMessages = {
  chatId: number;
  currentMessage: string;
  messages: ChatMessageType[];
};

export default function ChatContextProvider({ chatList, children }: PropsWithChildren<ChatContextProps>) {
  const { data: session } = useSession();
  const username = getUsername(session);

  const [client, setClient] = useState<Client | undefined>();
  const [selectedChatId, setSelectedChatId] = useState<number>();
  const [messages, setMessages] = useState<ChatMessageType[]>();
  const [currentMessage, setCurrentMessage] = useState<string>('');

  useEffect(() => {
    const newClient = new Client({
      brokerURL: `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
      onConnect: () => {
        chatList.forEach((c) => {
          newClient.subscribe(`/chat/${c.id}`, (message: IMessage) => {
            getMessages(c.id);
          });
        });
        console.log('stomp client 연결되었습니다.');
      },
      onStompError(frame) {
        console.log(frame);
      },
      onWebSocketError: (error) => console.log(error),
    });

    newClient.activate();
    setClient(newClient);

    return () => {
      client?.deactivate();
    };
  }, []);

  const getMessages = useCallback(async (selectedChatId: number) => {
    const fetchedMessage = await getChatMessage(selectedChatId);
    setMessages(fetchedMessage);
  }, []);

  useEffect(() => {
    if (!selectedChatId) return;
    getMessages(selectedChatId);
  }, [selectedChatId, getMessages]);

  const sendMessage = async () => {
    if (!client) return;

    client.publish({
      destination: '/app/chat',
      body: JSON.stringify({
        chatId: selectedChatId,
        sender: username,
        message: currentMessage,
      }),
    });

    setCurrentMessage('');
  };

  const value = {
    states: {
      client,
      chatList,
      selectedChatId,
      messages,
      currentMessage,
    },
    actions: {
      setSelectedChatId,
      sendMessage,
      setCurrentMessage,
    },
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const ChatContext = createContext<ChatContextType>({} as ChatContextType);

export type ChatContextState = {
  client: Client | undefined;
  chatList: ChatType[];
  selectedChatId: number | undefined;
  messages: ChatMessageType[] | undefined;
  currentMessage: string;
};

export type ChatContextActions = {
  setSelectedChatId: Dispatch<SetStateAction<number | undefined>>;
  sendMessage: () => {};
  setCurrentMessage: Dispatch<SetStateAction<string>>;
};

export type ChatContextType = {
  states: ChatContextState;
  actions: ChatContextActions;
};
