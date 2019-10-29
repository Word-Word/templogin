import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
//import * as GoogleSignIn from 'expo-google-app-auth';  // expo install expo-google-app-auth
import firebase from 'firebase'
//import * as Google from 'expo-google-app-auth';
import { GoogleSignIn } from 'expo';

class LoginScreen extends Component {

  // https://firebase.google.com/docs/auth/web/google-signin#고급:-수동으로-로그인-과정-처리하기
  // 불필요한 재인증을 피하려면 해당 Google 사용자가 Firebase에 이미 로그인된 상태가 아닌지 확인해야 합니다.
  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  // 로그인 버튼의 결과 콜백에서 Google의 인증 응답의 ID 토큰을 Firebase 사용자 인증 정보로 교환하여 Firebase에 로그인합니다.
  onSignIn = (googleUser) => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase
    .auth()
    .onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
             // googleUser.getAuthResponse().id_token
             googleUser.idToken,
             googleUser.accessToken
            );
        // Sign in with credential from the Google user.
        firebase
        .auth()
        .signInWithCredential(credential)
        .then(function(result) {
          console.log('user signed in');     
          if(result.additionalUserInfo.isNewUser)
          {

          
          firebase
          .database()
          .ref('/users/' + result.user.uid)
          .set({
            gmail: result.user.email,
            profile_picture: result.additionalUserInfo.profile.picture,
            local: result.additionalUserInfo.profile.local,
            first_name: result.additionalUserInfo.profile.given_name,
            last_name: result.additionalUserInfo.profile.family_name,
            created_at: Date.now()
          })
          .then(function (snapshot) {

          })
        } else {
          firebase
          .database()
          .ref('/users/' + result.user.uid).update({
            last_logged_in:Date.now()
          })
        }
        })
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    }.bind(this));
  }

  signInWithGoogleAsync = async() => {
    try {
      console.log("테스트1");
      
      const result = await GoogleSignIn.logInAsync({
        behavior:'web',
        androidClientId: "966393525101-kdmr3aq86qi0fmd2l8ksa8bl0qi4b4cu.apps.googleusercontent.com",
        //iosClientId: YOUR_CLIENT_ID_HERE,  // 아이폰
        scopes: ['profile', 'email'],
      });
  
      console.log("테스트2");
      if (result.type === 'success') {
        this.onSignIn(result);
        console.log("테스트3");
        return result.accessToken;
      } else {
        console.log("테스트4");
        return { cancelled: true };
      }
    } catch (e) {
      console.log("테스트5");
      return { error: true };
    }
  }


  render() {
    return (
      <View style={styles.container}>
        <Button 
          title='구글 로그인'
          onPress={()=>this.signInWithGoogleAsync()}
          //onPress={()=>alert('버튼 테스트')} 
          />
      </View>
    );
  }
}
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
