// @flow

import { AsyncStorage } from 'react-native';
import Auth0 from 'react-native-auth0';
import decode from 'jwt-decode';

const KEY = '!profile';

export type Profile = {
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
    state: string
  }
};

export const getUserInfo = async (): Promise<Profile | void> => {
  const p = await AsyncStorage.getItem(KEY);
  return p ? JSON.parse(p) : undefined;
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem(KEY);
};

export const authorize = async (): Promise<Profile> => {
  const auth0 = new Auth0({
    domain: 'olebedev.eu.auth0.com',
    clientId: 'YbAHcczyP672C0uHggH2a7BHcuFiLYTt'
  });

  const credentials = await auth0.webAuth.authorize({
    scope: 'openid profile email picture',
    audience: 'https://olebedev.eu.auth0.com/userinfo'
  });

  const p = {
    credentials,
    ...decode(credentials.idToken)
  };

  await AsyncStorage.setItem(KEY, JSON.stringify(p));
  return p;
};
