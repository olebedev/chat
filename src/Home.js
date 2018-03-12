// @flow

import * as React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
// import {SafeAreaView} from 'react-navigation';
import type { NavigationScreenProp } from "react-navigation";

type Props = {
  screenProps: {
    profile: { picture: string, username: string },
    logout: () => Promise<void>
  },
  navigation: NavigationScreenProp<{}>
};

const instructions = [
  "Welcome to example chat",
  "application based on SwarmDB."
].join("\n");

export default class Login extends React.Component<Props> {
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>The Chat</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <View style={styles.avatarWrap}>
          <Image
            style={styles.avatar}
            source={{ uri: this.props.screenProps.profile.picture }}
          />
        </View>
        <View style={styles.margin} />
        <TouchableOpacity
          style={styles.buttonWrap}
          onPress={this.props.screenProps.logout}
        >
          <Text style={styles.button}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonWrap}
          onPress={() => navigation.navigate("Chat")}
        >
          <Text style={styles.button}>Chat</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrap: {
    marginBottom: 67 + 12
  },
  button: {
    color: "#007AFF",
    fontSize: 16
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 5
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    margin: 5
  },
  margin: {
    ...Platform.select({
      android: {
        marginBottom: 10
      }
    })
  },
  avatarWrap: {
    margin: 5,
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    ...Platform.select({
      ios: {
        shadowColor: "#666",
        shadowOffset: {
          width: 0,
          height: 0
        },
        shadowOpacity: 0.4,
        shadowRadius: 2
      },
      android: {
        elevation: 5
      }
    })
  },
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 75 / 2,
    borderColor: "white",
    borderWidth: 3
  }
});
