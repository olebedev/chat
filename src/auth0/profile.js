// @flow

import UUID, { ERROR, BASE64 } from 'swarm-ron-uuid';

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

export const normalizePicture = (profile: Profile): string => {
  if (profile.picture.slice(0, 26) === 'https://lookaside.facebook') {
    return `https://graph.facebook.com/${profile.sub
      .split('|')
      .pop()}/picture?type=square`;
  }
  return profile.picture;
};

export const provider2uuid = (uniq: string): UUID => {
  const [provider, id] = uniq.split('|');
  if (!isHex(id)) return ERROR;
  const base = hex2base(id);
  if (base.length > 20) throw new Error('Unexpected length: ' + base.length);
  return new UUID(
    base.slice(0, 10),
    (base.slice(10) + '~' + provider).slice(0, 10),
    '%',
  );
};

const isHex = (input: string): boolean => {
  return /^[0-9a-fA-F]{1,}$/i.test(input);
};

const hex2base = (input: string): string => {
  let ret = '';
  for (let i = 0; i < input.length; i += 3) {
    const sl = input.slice(i, i + 3);
    let interm = parseInt((sl + '000').slice(0, 3), 16);
    ret += BASE64[(interm >> 6) % 64] + BASE64[interm % 64];
  }
  return ret;
};
