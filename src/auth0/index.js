// @flow

import { AsyncStorage } from 'react-native';
import Auth0 from 'react-native-auth0';
import decode from 'jwt-decode';
import { provider2uuid, normalizePicture } from './profile';

import type { Profile } from './profile';
export type { Profile } from './profile';

const KEY = '!profile';

export const getUserInfo = async (): Promise<Profile | void> => {
  const p = await AsyncStorage.getItem(KEY);
  if (p) {
    const parsed = JSON.parse(p);
    parsed.uuid = provider2uuid(parsed.sub);
    parsed.picture = normalizePicture(parsed);
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

  p.uuid = provider2uuid(p.sub);
  p.picture = normalizePicture(p);
  return p;
};
