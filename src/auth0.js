// @flow

import { AsyncStorage } from 'react-native';
import Auth0 from 'react-native-auth0';
import decode from 'jwt-decode';
import UUID from 'swarm-ron-uuid';
import * as utils from './utils';

const KEY = '!profile';

export type Profile = {
  uuid: UUID,
  nickname: string,
  name: string,
  picture: string,
  updated_at: string,
  email: string,
  email_verified: boolean,
  iss: string,
  sub: string,
  aud: string,
  iat: number,
  exp: number,
  nonce: string,
  credentials: {
    idToken: string,
    state: string,
  },
};

export const getUserInfo = async (): Promise<Profile | void> => {
  const p = await AsyncStorage.getItem(KEY);
  if (p) {
    const parsed = JSON.parse(p);
    parsed.uuid = utils.provider2uuid(parsed.sub);
    return parsed;
  }
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEY);
};

export const authorize = async (): Promise<Profile> => {
  const auth0 = new Auth0({
    domain: 'olebedev.eu.auth0.com',
    clientId: 'YbAHcczyP672C0uHggH2a7BHcuFiLYTt',
  });

  const credentials = await auth0.webAuth.authorize({
    scope: 'openid profile email picture',
    audience: 'https://olebedev.eu.auth0.com/userinfo',
  });

  const p = {
    credentials,
    ...decode(credentials.idToken),
  };

  await AsyncStorage.setItem(KEY, JSON.stringify(p));

  p.uuid = utils.provider2uuid(p.sub);
  return p;
};
