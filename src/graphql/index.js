// @flow

export { default as chatListScreen } from './chatListScreen';
export { default as createChat } from './createChat';
export { default as createUser } from './createUser';
export { default as messages } from './messages';
export { default as createMessage } from './createMessage';
export { default as deleteMessage } from './deleteMessage';
export type { Profile } from '../auth0';

export type User = {
  id: string,
  version: string,
  username: string,
  name: string,
  picture: string,
};

export type Author = {
  _id: string,
  name: string,
  avatar: string,
};

export type Message = {
  _id: string,
  createdAt: string | Date,
  text: string,
  user: Author,
  system: boolean,
  sent: boolean | void,
  received: boolean | void,
};

export type Chat = {
  id: string,
  version: string | void,
  picture: string | void,
  title: string | void,
  messages: {
    length: number,
    id: string,
    list: Message[],
  },
};
