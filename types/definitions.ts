export type PostType = Post & Date;
export type CommentType = Comment & Date;
export type ChatMessageType = ChatMessage & Date;
export type ChatType = Chat;

interface Post {
  id: number;
  user: UserProfileType;
  content: string;
  files?: FileType[];
  comments?: CommentType[];
  address?: AddressType;
}

interface Comment {
  id: number;
  user: UserProfileType;
  content: string;
  status: AcitveStatusType;
}

export type AddressType = {
  id?: number;
  code: string;
  sido: string;
  gungu: string;
  eupmyundong: string;
  li: string;
};

export type FileType = {
  url: FileUrl;
  status: AcitveStatusType;
};

export type FileUrl = {
  raw: string;
  lg: string;
  md: string;
  sm: string;
};

export type UserProfileType = {
  username: string;
  babyMonths?: number;
  content?: string;
  files?: FileType[];
  addresses?: AddressType[];
};

export enum AcitveStatusType {
  ACTIVE,
  INACTIVE,
}

interface Date {
  createdAt: string;
  modifiedAt?: string;
}

interface Chat {
  id: number;
  users: UserProfileType[];
  status: 'OPEN' | 'CLOSED';
}

interface ChatMessage {
  chatId: number;
  sender: string;
  message: string;
}
