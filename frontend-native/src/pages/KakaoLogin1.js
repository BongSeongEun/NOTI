/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
import { Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import queryString from 'query-string';

const KakaoLogin = () => {
  const navigation = useNavigation();

	const handleNavigationStateChange = navState => {
		if (navState.url.includes('success')) {
			const { url } = navState;
			// URL에서 토큰 추출
			const jwtToken = url.split('token=')[1];
			AsyncStorage.setItem('token', jwtToken)
				.then(() => console.log('Token stored successfully'))
				.catch(error => console.error('Error storing token:', error));
			// 조건 충족 시 'Register' 화면으로 네비게이션
			navigation.navigate('Register');
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<WebView
				style={{ flex: 1 }}
				source={{
					uri: 'https://kauth.kakao.com/oauth/authorize?client_id=77cf97c36317f2622a926b9ddb30f96f&redirect_uri=http://192.168.30.197:4000/authnative&response_type=code',
				}}
				onNavigationStateChange={handleNavigationStateChange}
			/>
		</SafeAreaView>
	);
};
export default KakaoLogin;
