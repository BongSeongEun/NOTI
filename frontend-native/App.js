/* eslint-disable prettier/prettier */
import React from 'react';
import {Linking} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import styled from 'styled-components/native';
import 'react-native-gesture-handler';

import Login from './src/pages/Login';
import Coop from './src/pages/Coop';
import Coop_Main from './src/pages/Coop_Main';
import Diary from './src/pages/Diary';
import Register from './src/pages/Register';
import Register_Success from './src/pages/Register_Success';
import Setting from './src/pages/Setting';
import Todo from './src/pages/Todo';
import Chatting from './src/pages/Chatting';
import Todo_Add from './src/pages/Todo_Add';
import KakaoLogin from './src/pages/KakaoLogin1';
import Redirection from './src/pages/Redirection';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['http://192.168.75.126:4000/authnative'], // 여기에 딥 링크에 사용할 스킴을 추가합니다.
  config: {
    screens: {
      Redirection: 'Redirection', // 여기에 리디렉션 URL의 경로와 매칭되는 화면 이름을 설정합니다.
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Login">
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

        <Stack.Screen name="Diary" component={Diary} />
        <Stack.Screen name="Setting" component={Setting} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
