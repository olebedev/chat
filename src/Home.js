// @flow

import * as React from 'react';
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import type { NavigationScreenProp } from 'react-navigation';
import SwarmDB from 'swarm-db';
import { GraphQL } from 'swarm-react';
import type { Response } from 'swarm-react';

import ChatList from './ChatList';
import type { User, Chat } from './ChatList';
import type { Profile } from './auth0';

import { chatListScreen, createUser, createChat } from './graphql';

export const Avatar = ({ profile }: { profile: Profile }) => (
  <TouchableOpacity style={styles.logout}>
    <View style={styles.avatarSmallWrap}>
      <Image style={styles.avatarSmall} source={{ uri: profile.picture }} />
    </View>
  </TouchableOpacity>
);

export const Logout = ({
  logout,
  clear,
}: {
  logout: () => void,
  clear: () => Promise<void>,
}) => (
  <TouchableOpacity
    onPress={logout}
    onLongPress={() => {
      clear().then(logout);
    }}
    style={styles.logout}>
    <Image
      style={styles.logoutImage}
      resizeMode="contain"
      source={require('./logout.png')}
    />
  </TouchableOpacity>
);

type chatListScreenResponse = {
  chats: {
    id: string,
    version: string,
    length: number,
    list: Chat[],
  },
  user: User,
} | null;

type Props = {
  screenProps: {
    profile: Profile,
    logout: () => Promise<void>,
    swarm: SwarmDB,
  },
  navigation: NavigationScreenProp<{}>,
};

export default class ChatsScreen extends React.Component<Props> {
  once: boolean;

  constructor(props: Props, context: any) {
    super(props, context);
    this.once = false;
  }

  // check if we have to create initial state of the app
  checkOnce = async (r: Response<chatListScreenResponse>): Promise<void> => {
    if (this.once) return;

    const { data } = r;
    if (!data) return;

    this.once = true;

    // eslint-disable-next-line
    __DEV__ && console.log('once', data);

    if (data.user.version === '0') {
      const { createUser: cu } = r.mutations || {};
      if (cu) {
        const {
          uuid,
          nickname,
          name,
          picture,
          updated_at,
          email,
        } = this.props.screenProps.profile;
        await cu({
          id: uuid,
          payload: { nickname, name, picture, updated_at, email },
        });
      }
    }

    const { uuid } = this.props.screenProps.profile;

    if (data.chats.version === '0') {
      const { createChat: cc } = r.mutations || {};
      if (cc) {
        for (const title of ['Random', 'General', 'Boom']) {
          const id = r.uuid(); // chat
          const ms = r.uuid(); // messages for the chat
          const mid = r.uuid(); // system message

          const res = await cc({
            id,
            payload: {
              picture: `https://i1.wp.com/cdn.auth0.com/avatars/${title[0].toLowerCase()}.png?ssl=1`,
              title,
              messages: ms,
            },
            ms,
            mid,
            message: {
              text: 'Chat created',
              system: true,
              user: uuid,
            },
          });
          // eslint-disable-next-line
          __DEV__ && console.log('created?', { title, res });
        }
      }
    }
  };

  render() {
    const { navigation, screenProps: { profile } } = this.props;
    const dev = __DEV__ || profile.uuid.toString() === 'X8Kq%~github'; // eslint-disable-line
    dev && console.log('chat screen render for', { profile });
    return (
      <View style={styles.container}>
        <GraphQL
          query={chatListScreen}
          args={{ user: profile.uuid, dev }}
          mutations={{ createChat, createUser }}>
          {(update: Response<chatListScreenResponse>): React.Node => {
            this.checkOnce(update).catch(error => console.error(error));
            dev && console.log('chats', update.data);
            if (!update.data || !update.data.chats || !update.data.user) {
              return <ActivityIndicator size="small" color="#666" />;
            }
            return (
              <ChatList
                profile={profile}
                chats={update.data.chats}
                onPress={chat => navigation.navigate('Chat', { chat, profile })}
              />
            );
          }}
        </GraphQL>
      </View>
    );
  }
}

const smallAvaSize = 33;

const styles = StyleSheet.create({
  buttonWrap: {
    marginBottom: 67 + 12,
  },
  button: {
    color: '#007AFF',
    fontSize: 16,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 5,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    margin: 5,
  },
  margin: {
    ...Platform.select({
      android: {
        marginBottom: 10,
      },
    }),
  },
  avatarWrap: {
    margin: 5,
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    ...Platform.select({
      ios: {
        shadowColor: '#666',
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    borderColor: 'white',
    borderWidth: 3,
  },
  avatarSmall: {
    width: smallAvaSize,
    height: smallAvaSize,
    borderRadius: smallAvaSize / 2,
    borderColor: 'white',
    borderWidth: 1,
  },
  avatarSmallWrap: {
    margin: 5,
    marginLeft: 15,
    width: smallAvaSize,
    height: smallAvaSize,
    borderRadius: smallAvaSize / 2,
  },
  logout: {
    // justifyItems: 'center',
  },
  logoutImage: {
    tintColor: '#007AFF',
    height: smallAvaSize * 0.7,
    width: smallAvaSize * 0.7,
    marginRight: 15,
  },
});
