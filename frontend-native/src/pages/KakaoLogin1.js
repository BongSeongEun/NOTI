/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';

// 디바이스의 화면 너비와 높이를 가져옵니다.

const KakaoLogin = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        style={{flex: 1}}
        source={{
          uri: 'https://kauth.kakao.com/oauth/authorize?client_id=77cf97c36317f2622a926b9ddb30f96f&redirect_uri=http://192.168.102.11:3000/auth&response_type=code',
        }}
      />
    </SafeAreaView>
  );
};
export default KakaoLogin;
