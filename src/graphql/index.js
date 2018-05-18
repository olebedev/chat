// @flow

export { default as chatListScreen } from './chatListScreen';
export { default as createChat } from './createChat';
export { default as createUser } from './createUser';
export { default as messages } from './messages';
export { default as createMessage } from './createMessage';
export { default as deleteMessage } from './deleteMessage';
export type { Profile } from '../auth0';

export type Author = {
  _id: string,
  name: string,
  avatar: string,
};

export type Message = {
  _id: string,
  createdAt: Date,
  text: string,
  user: Author,
  system: boolean,
};

export type Chat = {
  id: string,
  picture: string,
  title: string,
  messages: {
    id: string,
    length: number,
    list: Message[],
  },
};

export type User = {
  id: string,
  username: string,
  picture: string,
};
