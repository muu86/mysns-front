import { ChatType } from '@/types/definitions';
import { Client, IMessage } from '@stomp/stompjs';

export function getClient() {
  const client = new Client({
    brokerURL: `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}`,
    onConnect: () => {
      // client.subscribe(`/user/${username}/queue/message`, onConnect);
      // chatList.forEach((c) => {
      //   client.subscribe(`/chat/${c.id}`, onConnect);
      // });
      console.log('stomp client 연결되었습니다.');
    },
    onStompError(frame) {
      console.log(frame);
    },
    onWebSocketError: (error) => console.log(error),
  });

  // client.activate();
  return client;
}

export function exit(client: Client) {
  client.deactivate();
}

export function send({ client, id, sender, message }: { client: Client; id: number; sender: string; message: string }) {
  client.publish({
    destination: '/app/chat',
    body: JSON.stringify({
      chatId: id,
      sender,
      message,
    }),
  });
}

function onConnect(message: IMessage) {
  console.log(`received: ${message.body}`);
}

async function findAndDisplayConnectedUsers() {
  let connectedUsers = await fetch('http://localhost:8080/users');
  connectedUsers = await connectedUsers.json();
  return connectedUsers;
}
