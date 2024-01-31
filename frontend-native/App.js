/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
///* eslint-disable prettier/prettier */
//
//import React, {useState, useEffect} from 'react';
//import {
//  SafeAreaView,
//  ScrollView,
//  StatusBar,
//  StyleSheet,
//  useColorScheme,
//  View,
//} from 'react-native';
//import styled from 'styled-components/native';
//import NOTI from './asset/KakaoTalk_20240105_025742662.png';
//import NAVER from './asset/NAVER.png';
//import GOOGLE from './asset/GOOGLE.png';
//import KAKAO from './asset/KAKAO.png';
//
//const Container = styled.View`
//  flex: 1;
//  background-color: '#f9f9f9';
//  align-items: center;
//  justify-content: center;
//`;
//const Text = styled.Text`
//  font-size: 22px;
//  color: black;
//  margin-bottom: 20px;
//`;
//const Image = styled.Image`
//  width: 60%;
//  height: 40%;
//  margin-bottom: 20px;
//`;
//const LoginImage = styled.Image`
//  width: 85%;
//  height: 7%;
//  margin-bottom: 20px;
//`;
//
//function App() {
//  const [message, setMessage] = useState([]);
//
//  useEffect(() => {
//    fetch('http://localhost:4000/api/v1/welcome')
//      .then(response => response.json())
//      .then(data => setMessage(data))
//      .catch(error => {
//        console.log(error);
//      });
//  }, []);
//
//  return (
//    <Container>
//      <Image source={NOTI} />
//      <Text>{message}</Text>
//      <LoginImage resizeMode={'contain'} source={NAVER} />
//      <LoginImage resizeMode={'contain'} source={GOOGLE} />
//      <LoginImage resizeMode={'contain'} source={KAKAO} />
//    </Container>
//  );
//}
//
//export default App;

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import styled from "styled-components/native";
import 'react-native-gesture-handler';

import Login from "./src/pages/Login";
import Coop from "./src/pages/Coop";
import Diary from "./src/pages/Diary";
import Register from "./src/pages/Register";
import Register_Success from "./src/pages/Register_Success";
import Setting from "./src/pages/Setting";
import Todo from "./src/pages/Todo";
import Todo_Add from "./src/pages/Todo_Add";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    	<Stack.Navigator initialRouteName="Login">
        	<Stack.Screen name="Login" component={Login} />
        
			<Stack.Screen name="Register" component={Register} />
			  <Stack.Screen name="Register_Success" component={Register_Success} />
		
			<Stack.Screen name="Todo" component={Todo} />
			<Stack.Screen name="Todo_Add" component={Todo_Add} />
			<Stack.Screen name="Coop" component={Coop} />

			<Stack.Screen name="Diary" component={Diary} />
			<Stack.Screen name="Setting" component={Setting} />
      	</Stack.Navigator>
    </NavigationContainer>
  );
}