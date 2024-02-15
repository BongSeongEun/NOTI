/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Dimensions} from 'react-native';

// 디바이스의 화면 너비와 높이를 가져옵니다.

const KakaoLogin = () => {
  const navigation = useNavigation();

  const handleNavigationStateChange = navState => {
    // 성공 URL 패턴 확인 예시: http://192.168.75.126:4000/authnative?success
    if (navState.url.includes('success')) {
      // 조건 충족 시 'Register' 화면으로 네비게이션
      navigation.navigate('Register');
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <WebView
        style={{flex: 1}}
        source={{
          uri: 'https://kauth.kakao.com/oauth/authorize?client_id=77cf97c36317f2622a926b9ddb30f96f&redirect_uri=http://192.168.30.112:4000/authnative&response_type=code',
        }}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </SafeAreaView>
  );
};
export default KakaoLogin;
