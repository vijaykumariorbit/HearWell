import React from 'react';

// Import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Alert,
} from 'react-native';
import { appleAuth, appleAuthAndroid, AppleButton } from '@invertase/react-native-apple-authentication';

import AppleLogo from '../assets/apple-logo.png';

const AppleAuth = () => {

  const onAppleButtonPress = async () => {

    try {
      let response = {};
      let appleId = '';
      let appleToken = '';
      let appleEmail = '';
      if (Platform.OS === 'ios') {
        // Performs login request requesting user email
        response = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL],
        });
        // On iOS, user ID and email are easily retrieved from request
        appleId = response.user;
        appleToken = response.identityToken;
        appleEmail = response.email;
      } else if (Platform.OS === 'android') {
        // Configure the request
        appleAuthAndroid.configure({
          // The Service ID you registered with Apple
          clientId: 'YOUR_SERVICE_IO',
          // Return URL added to your Apple dev console
          redirectUri: 'YOUR_SERVICE_URL',
          responseType: appleAuthAndroid.ResponseType.ALL,
          scope: appleAuthAndroid.Scope.ALL,
        });
        response = await appleAuthAndroid.signIn();
        // Decode user ID and email from token returned from Apple,
        // this is a common workaround for Apple sign-in via web API
        const decodedIdToken = jwt_decode(response.id_token);
        appleId = decodedIdToken.sub;
        appleToken = response.id_token;
        appleEmail = decodedIdToken.email;
      }
      // Format authData to provide correctly for Apple linkWith on Parse
      const authData = {
        id: appleId,
        token: appleToken,
      };
      // Log in or sign up on Parse using this Apple credentials
      let userToLogin = new Parse.User();
      // Set username and email to match provider email
      userToLogin.set('username', appleEmail);
      userToLogin.set('email', appleEmail);
      return await userToLogin
        .linkWith('apple', {
          authData: authData,
        })
        .then(async (loggedInUser) => {
          // logIn returns the corresponding ParseUser object
          Alert.alert(
            'Success!',
            `User ${loggedInUser.get('username')} has successfully signed in!`,
          );
          // To verify that this is in fact the current user, currentAsync can be used
          const currentUser = await Parse.User.currentAsync();
          console.log(loggedInUser === currentUser);
          // Navigation.navigate takes the user to the screen named after the one
          // passed as parameter
          navigation.navigate('Home');
          return true;
        })
        .catch(async (error) => {
          // Error can be caused by wrong parameters or lack of Internet connection
          Alert.alert('Error!', error.message);
          return false;
        });
    } catch (error) {
      // Error can be caused by wrong parameters or lack of Internet connection
      Alert.alert('Error!', error);
      return false;
    }

  }


    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.container}>            
            {appleAuthAndroid.isSupported && (
              <AppleButton
                style={{ width: 240, height: 40, }}
                buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                buttonType={AppleButton.Type.SIGN_IN}
                onPress={() => onAppleButtonPress()}
                leftView={<Image style={{ width: 20, height: 20, position: 'relative', right: 30 }} source={AppleLogo} />}
              />
            )}
          </View>
        </View>
      </SafeAreaView>
    );
  }

export default AppleAuth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
  imageStyle: {
    width: 200,
    height: 300,
    resizeMode: 'contain',
  },
  buttonStyle: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    width: 300,
    marginTop: 30,
  },
  footerHeading: {
    fontSize: 18,
    textAlign: 'center',
    color: 'grey',
  },
  footerText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'grey',
  },
});