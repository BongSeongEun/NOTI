/* eslint-disable prettier/prettier */
import React from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {WebView} from 'react-native-webview';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KakaoLogin = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { nextScreen } = route.params;

	const handleNavigationStateChange = navState => {
		if (navState.url.includes('success')) {
			const { url } = navState;
			const jwtToken = url.split('token=')[1];
			AsyncStorage.setItem('token', jwtToken)
				.then(() => {
					navigation.navigate(nextScreen);
				})
				.catch(error => console.error('Error storing token:', error));
		}
	};

	return (
		<SafeAreaView style={{ flex: 1 }}>
			<WebView
				style={{ flex: 1 }}
				source={{
					uri: 'https://kauth.kakao.com/oauth/authorize?client_id=77cf97c36317f2622a926b9ddb30f96f&redirect_uri=http://192.168.30.214:4000/authnative&response_type=code',
				}}
				onNavigationStateChange={handleNavigationStateChange}
			/>
		</SafeAreaView>
	);
};

export default KakaoLogin;
