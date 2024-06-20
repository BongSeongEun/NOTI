/* eslint-disable prettier/prettier */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import styled from 'styled-components/native';
import 'react-native-gesture-handler';

import Login from "./src/pages/Login";
import Coop from "./src/pages/Coop";
import Coop_Main from "./src/pages/Coop_Main";
import Diary_Main from "./src/pages/Diary_Main";
import Diary from "./src/pages/Diary";
import Register from "./src/pages/Register";
import Register_Success from "./src/pages/Register_Success";
import Setting from "./src/pages/Setting";
import Setting_user from "./src/pages/Setting_user";
import Todo from "./src/pages/Todo";
import Chatting from "./src/pages/Chatting";
import Todo_Add from "./src/pages/Todo_Add";
import KakaoLogin from './src/pages/KakaoLogin1';
import Redirection from './src/pages/Redirection';
import Stat from './src/pages/Stat';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="kakaoLogin" component={KakaoLogin} />
        <Stack.Screen name="Redirection" component={Redirection} />

        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Register_Success" component={Register_Success} />

        <Stack.Screen name="Todo" component={Todo} />

        <Stack.Screen name="Chatting" component={Chatting} />
        <Stack.Screen name="Todo_Add" component={Todo_Add} />
        <Stack.Screen name="Coop" component={Coop} />
        <Stack.Screen name="Coop_Main" component={Coop_Main} />

			  <Stack.Screen name="Diary_Main" component={Diary_Main} />
			  <Stack.Screen name="Diary" component={Diary} />
			  <Stack.Screen name="Setting" component={Setting} />
			  <Stack.Screen name="Setting_user" component={Setting_user} />
			  <Stack.Screen name="Stat" component={Stat} />
      	</Stack.Navigator>
    </NavigationContainer>
  );
}
