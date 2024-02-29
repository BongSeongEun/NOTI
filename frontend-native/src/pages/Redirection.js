/* eslint-disable no-undef */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {View, Text, Linking} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Redirection = () => {
	const navigation = useNavigation();

	useEffect(() => {
		const handleDeepLink = event => {
			const code = new URL(event.url).searchParams.get('code');
			if (code) {
				axios
					.post(`http://192.168.30.214/authnative?code=${code}`)
					.then(async res => {
						const params = new URLSearchParams(location.search);
						const token = params.get("token");
						await AsyncStorage.setItem(token);
						navigation.navigate('Todo');
					})
					.catch(err => console.log(err));
			}
		};

		Linking.addEventListener('url', handleDeepLink);

		return () => {
			Linking.removeEventListener('url', handleDeepLink);
		};
	}, [navigation]);

	return (
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
			<Text>Redirecting...</Text>
		</View>
	);
};

export default Redirection;
