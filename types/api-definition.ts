import { AddressType, CommentType, FileType, UserProfileType } from './definitions';

export type ApiError = {
  error: boolean;
  message: string;
};

export type GetUserResponse = {
  username: string;
};

export type GetPostPayload = {
  username?: string;
  latitude?: number;
  longitude?: number;
  addressCode?: string;
  distance?: number;
  limit?: number;
  offset?: number;
};

export type GetPostResult = {
  user: UserProfileType;
  content: string;
  files: FileType[];
  address: AddressType;
  comments: CommentType[];
  createdAt: string;
  modifiedAt?: string;
};

export type UpdateUserPayload = {
  username: string;
  nextUsername?: string;
  babyAge?: number;
  content?: string;
  addresses?: string[];
  file?: FileType;
};

export type GetCommentPayload = {
  postId: number;
  offset?: number;
};

export type GetChatMessagePayload = {
  chatId: number;
  page?: number;
  size?: number;
};
