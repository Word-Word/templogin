import React from "react"
import { StyleSheet, Text, View } from "react-native"
import { createAppContainer, createSwitchNavigator } from "react-navigation"

import LoginScreen from "./screens/LoginSereen"
import LoadingScreen from "./screens/LoadingScreen"
import DashboardScreen from "./screens/DashboardScreen"

import firebase from 'firebase';
import { firebaseConfig } from "./config"
firebase.initializeApp(firebaseConfig)

// 리액트 네비게이션 공식문서대로 설치
// ( https://reactnavigation.org/docs/en/getting-started.html#installation )
// expo install react-navigation react-native-gesture-handler react-native-reanimated react-native-screens
// (이후 이거 설치) yarn add firebase

export default function App() {
  //return <AppNavigator />
  <View>
    <Text> ㅎㅇ </Text>
  </View>
}

const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen: LoadingScreen,
  LoginScreen: LoginScreen,
  DashboardScreen: DashboardScreen,
})

const AppNavigator = createAppContainer(AppSwitchNavigator)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
})
