/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/self-closing-comp */

import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function Login({}) {
  const navigation = useNavigation();

  return (
    <View>
      <Text>Login!</Text>
      <Button
        title="회원가입"
        onPress={() => navigation.navigate('kakaoLogin', { nextScreen: 'Register' })}>
      </Button>
      <Button
        title="로그인"
        onPress={() => navigation.navigate('kakaoLogin', { nextScreen: 'Todo' })}>
      </Button>
    </View>
  );
}

export default Login;