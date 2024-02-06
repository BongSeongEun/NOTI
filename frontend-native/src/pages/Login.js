/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/self-closing-comp */

/* install 명령어

npm install @react-navigation/native --save --legacy-peer-deps
expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install @react-navigation/stack --save --legacy-peer-deps

*/

import React from 'react';
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";


function Login({}) {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Login!</Text>
	    <Button
    	  title="회원가입"
          // eslint-disable-next-line quotes
          onPress={() => navigation.navigate("Register")}>
        </Button>
        <Button
          title="채팅"
          // eslint-disable-next-line quotes
          onPress={() => navigation.navigate("Chatting")}>
        </Button>
    </View>
  );
}

export default Login;

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