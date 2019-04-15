/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
} from 'react-native';
import { LoginButton, AccessToken, ShareDialog } from 'react-native-fbsdk';
import ImagePicker from 'react-native-image-picker';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const options = {
  title: 'Select photo',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

export default class App extends Component {
  state = {
    shareLinkContent: {
      contentType: 'link',
      contentUrl: 'https://www.facebook.com/',
      contentDescription: 'Facebook sharing is easy!',
    },
  };

  _shareLink = () => {
    const tmp = this;
    ShareDialog.canShow(this.state.shareLinkContent)
      .then(function(canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      })
      .then(
        function(result) {
          if (result.isCancelled) {
            alert('Share cancelled');
          } else {
            alert('Share success with postId: ' + result.postId);
          }
        },
        function(error) {
          alert('Share fail with error: ' + error);
        },
      );
  };

  _sharePhoto = () => {
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log('bla source', source);

        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        // this.setState({
        //   avatarSource: source
        // });
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <LoginButton
          onLoginFinished={(error, result) => {
            if (error) {
              console.log('login has error: ' + result.error);
            } else if (result.isCancelled) {
              console.log('login is cancelled.');
            } else {
              AccessToken.getCurrentAccessToken().then(data => {
                console.log(data.accessToken.toString());
              });
            }
          }}
          onLogoutFinished={() => console.log('logout.')}
        />
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
        <TouchableHighlight onPress={this._shareLink}>
          <Text>Share bla</Text>
        </TouchableHighlight>
        <TouchableHighlight onPress={this._sharePhoto}>
          <Text>Share some photo</Text>
        </TouchableHighlight>
        <Image />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
