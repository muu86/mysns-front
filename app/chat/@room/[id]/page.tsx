import ChatInput from '@/components/chat/chat-input';
import ChatMessageContainer from '@/components/chat/chat-message-container';
import Container from '@/components/container';

export default async function Page({ params }: { params: { id: number } }) {
  return (
    <Container>
      <ChatMessageContainer id={params.id} />
      <ChatInput />
    </Container>
  );
}
