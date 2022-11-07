import React, { useState, useEffect } from 'react';

// Import all the components we are going to use
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';

// Import Google Signin
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
// import { Form, Field } from 'react-final-form';
// import { required, email, length } from 'redux-form-validators';
// import { appleAuth, appleAuthAndroid, AppleButton } from '@invertase/react-native-apple-authentication';
// import AppleLogo from './assets/apple-logo.png'
// import Input from './components/Field/input';
// import SubmitButton from './components/SubmitButton';

const GoogleAuth = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [gettingLoginStatus, setGettingLoginStatus] = useState(true);

  useEffect(() => {
    // Initial configuration
    GoogleSignin.configure({
      // Mandatory method to call before calling signIn()
      //   scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
      // Repleace with your webClientId
      // Generated from Firebase console
      webClientId: '74675969131-094ovgkc4o2qvqk8rh2t8datpm6rto4a.apps.googleusercontent.com',
    });
    // Check if user is already signed in
    _isSignedIn();
  }, []);

  // const onAppleButtonPress = async () => {

  //   try {
  //     let response = {};
  //     let appleId = '';
  //     let appleToken = '';
  //     let appleEmail = '';
  //     if (Platform.OS === 'ios') {
  //       // Performs login request requesting user email
  //       response = await appleAuth.performRequest({
  //         requestedOperation: appleAuth.Operation.LOGIN,
  //         requestedScopes: [appleAuth.Scope.EMAIL],
  //       });
  //       // On iOS, user ID and email are easily retrieved from request
  //       appleId = response.user;
  //       appleToken = response.identityToken;
  //       appleEmail = response.email;
  //     } else if (Platform.OS === 'android') {
  //       // Configure the request
  //       appleAuthAndroid.configure({
  //         // The Service ID you registered with Apple
  //         clientId: 'YOUR_SERVICE_IO',
  //         // Return URL added to your Apple dev console
  //         redirectUri: 'YOUR_SERVICE_URL',
  //         responseType: appleAuthAndroid.ResponseType.ALL,
  //         scope: appleAuthAndroid.Scope.ALL,
  //       });
  //       response = await appleAuthAndroid.signIn();
  //       // Decode user ID and email from token returned from Apple,
  //       // this is a common workaround for Apple sign-in via web API
  //       const decodedIdToken = jwt_decode(response.id_token);
  //       appleId = decodedIdToken.sub;
  //       appleToken = response.id_token;
  //       appleEmail = decodedIdToken.email;
  //     }
  //     // Format authData to provide correctly for Apple linkWith on Parse
  //     const authData = {
  //       id: appleId,
  //       token: appleToken,
  //     };
  //     // Log in or sign up on Parse using this Apple credentials
  //     let userToLogin = new Parse.User();
  //     // Set username and email to match provider email
  //     userToLogin.set('username', appleEmail);
  //     userToLogin.set('email', appleEmail);
  //     return await userToLogin
  //       .linkWith('apple', {
  //         authData: authData,
  //       })
  //       .then(async (loggedInUser) => {
  //         // logIn returns the corresponding ParseUser object
  //         Alert.alert(
  //           'Success!',
  //           `User ${loggedInUser.get('username')} has successfully signed in!`,
  //         );
  //         // To verify that this is in fact the current user, currentAsync can be used
  //         const currentUser = await Parse.User.currentAsync();
  //         console.log(loggedInUser === currentUser);
  //         // Navigation.navigate takes the user to the screen named after the one
  //         // passed as parameter
  //         navigation.navigate('Home');
  //         return true;
  //       })
  //       .catch(async (error) => {
  //         // Error can be caused by wrong parameters or lack of Internet connection
  //         Alert.alert('Error!', error.message);
  //         return false;
  //       });
  //   } catch (error) {
  //     // Error can be caused by wrong parameters or lack of Internet connection
  //     Alert.alert('Error!', error);
  //     return false;
  //   }

  // }

  const _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      alert('User is already signed in');
      // Set User Info if user is already signed in
      _getCurrentUserInfo();
    } else {
      console.log('Please Login');
    }
    setGettingLoginStatus(false);
  };

  const _getCurrentUserInfo = async () => {
    try {
      let info = await GoogleSignin.signInSilently();
      console.log('User Info --> ', info);
      setUserInfo(info);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        console.log('User has not signed in yet');
      } else {
        alert("Unable to get user's info");
        console.log("Unable to get user's info");
      }
    }
  };

  const _signIn = async () => {
    // It will prompt google Signin Widget
    try {
      await GoogleSignin.hasPlayServices({
        // Check if device has Google Play Services installed
        // Always resolves to true on iOS
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info --> ', userInfo);
      setUserInfo(userInfo);
    } catch (error) {
      console.log('Message', JSON.stringify(error));
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        alert('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        alert('Signing In');
      } else if (
        error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE
      ) {
        alert('Play Services Not Available or Outdated');
      } else {
        alert(error.message);
      }
    }
  };

  // const submit = value => {
  //   console.log(value, 'value');
  // }

  // const composeValidators = (...validators) => value =>
  //   validators.reduce((error, validator) => error || validator(value), undefined)

  const _signOut = async () => {
    setGettingLoginStatus(true);
    // Remove user session from the device.
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      // Removing user Info
      setUserInfo(null);
    } catch (error) {
      console.error(error);
    }
    setGettingLoginStatus(false);
  };

  if (gettingLoginStatus) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {userInfo === null && <Text style={styles.titleText}>
            Login
          </Text>}
          {userInfo !== null &&
            <Text style={styles.titleText}>Logout</Text>
          }
          <View style={styles.container}>
            {userInfo !== null ? (
              <>
                <Image
                  source={{uri: userInfo.user.photo}}
                  style={styles.imageStyle}
                />
                <Text style={styles.text}>
                  Name: {userInfo.user.name}
                </Text>
                <Text style={styles.text}>
                  Email: {userInfo.user.email}
                </Text>
                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={_signOut}>
                  <Text>Logout</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.buttonStyle}
                  onPress={_signOut}>
                  <Text>Logout</Text>
                </TouchableOpacity>           
              </>
            ) : (
              <GoogleSigninButton
                style={{ width: 250, height: 48, marginBottom: 10 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Light}
                onPress={_signIn}
              />
            )}
            {/* {appleAuthAndroid.isSupported && (
              <AppleButton
                style={{ width: 240, height: 40, }}
                buttonStyle={AppleButton.Style.WHITE_OUTLINE}
                buttonType={AppleButton.Type.SIGN_IN}
                onPress={() => onAppleButtonPress()}
                leftView={<Image style={{ width: 20, height: 20, position: 'relative', right: 30 }} source={AppleLogo} />}
              />
            )} */}
            {/* <View style={{ marginTop: 40 }}>
              <View style={{ alignSelf: 'center', marginBottom: 20 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#000' }}>Register</Text>
              </View>
              <Form onSubmit={submit}
                render={({ handleSubmit, invalid }) => (
                  <View>
                    <Field
                      name='username'
                      label="Username *"
                      validate={composeValidators(required(), email())}
                      keyboardType={'email-address'}
                      autoCapitalize={'none'}
                      component={Input}
                      placeholderName='Email Address'
                    />
                    <Field
                      name='password'
                      label="Password *"
                      validate={composeValidators(required(), length({ min: 8 }))}
                      keyboardType={'password'}
                      autoCapitalize={'none'}
                      component={Input}
                      placeholderName='Password'
                    />
                    <View style={{ backgroundColor: '#000', opacity: invalid !== true ? 1 : 0.5, padding: 10, borderRadius: 5, alignSelf: 'center' }}>
                      <SubmitButton
                        disabled={invalid == true && true}
                        submit={handleSubmit}
                        text='Sign Up'
                        textStyle={{ color: '#fff' }}
                      />
                    </View>
                  </View>
                )
                }
              />
            </View> */}
          </View>
        </View>
      </SafeAreaView>
    );
  }
};

export default GoogleAuth;

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