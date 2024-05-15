/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import styled, { ThemeProvider } from 'styled-components/native';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity
} from "react-native";
import 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import images from "../components/images";
import theme from '../components/theme';
import Navigation_Bar from "../components/Navigation_Bar";


function Setting({ }) {
	const navigation = useNavigation();
	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
	const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');
	const [token, setToken] = useState('');

	const fetchUserData = async () => {
		const storedToken = await AsyncStorage.getItem('token');
		setToken(storedToken);
		if (!storedToken) return;

		if (storedToken) {
			const userId = getUserIdFromToken(storedToken);
			try {
				const response = await axios.get(`http://15.164.151.130:4000/api/v1/userInfo/${userId}`, {
					headers: {
						'Authorization': `Bearer ${storedToken}`,
					},
				});
				const userThemeName = response.data.userColor || 'OrangeTheme';
				const userProfileImage = response.data.userProfile;
				const nickname = response.data.userNickname;

				if (theme[userThemeName]) {
					setCurrentTheme(theme[userThemeName]);
				}
				setBase64Image(userProfileImage || "");
				setUserNickname(nickname || "");
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		}
	};
	
	useEffect(() => {
		fetchUserData();
	}, [token]);

	const getUserIdFromToken = (token) => {
		try {
			const payload = token.split('.')[1];
			const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
			const decodedPayload = decode(base64);
			const decodedJSON = JSON.parse(decodedPayload);

			return decodedJSON.id.toString();
		} catch (error) {
			console.error('Error decoding token:', error);
			return null;
		}
	};

	const handleLogout = async () => {
		try {
			await AsyncStorage.removeItem('token');
			navigation.navigate('Login');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	};

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView style={{ flex: 1, marginBottom: 80 }}>
				<MainView>
					<HorisontalView style={{ marginTop: 20, marginBottom: 10 }}>
						<Profile source={base64Image ? { uri: base64Image } : images.profile}
							style={{ marginTop: 20 }} />
						<ProfileTextContainer>
							<MainText>{userNickname} 님,</MainText>
							<MainText>설정 페이지 입니다!</MainText>
						</ProfileTextContainer>
					</HorisontalView>

					<View>
						<TouchableOpacity onPress={() => navigation.navigate('Setting_user', { currentTheme: currentTheme })}>
							<MainText style={{ fontSize: 15 }}>회원 정보 수정</MainText>
						</TouchableOpacity>
						<TouchableOpacity onPress={handleLogout} style={{ marginTop: 20 }}>
							<MainText style={{ fontSize: 15, color: currentTheme.color1 }}>로그아웃</MainText>
						</TouchableOpacity>
					</View>
				</MainView>
			</FullView>
			<Navigation_Bar />
		</ThemeProvider>
	);
}

const FullView = styled.View`
   width: 100%;
   background-color: white;
   height: 100%;
`;

const MainView = styled(FullView)`
   height: auto;
   align-self: center;
   width: 300px;
`;

const HorisontalView = styled(MainView)`
   flex-direction: row;
`;

const MainText = styled.Text`
    font-size: ${props => props.fontSize || "12px"};
    font-weight: bold;
    color: ${props => props.color || "black"};
    text-align: left;
	flex-wrap: wrap;
`;

const ProfileContainer = styled.View`
    display: flex;
    flex-direction: row;
`;

const ProfileTextContainer = styled(ProfileContainer)`
	flex-direction: column;
	margin-top: 25px;
	margin-left: 15px;
	margin-bottom: 25px;
`;

const Profile = styled.Image`
    width: 40px;
    height: 40px;
    margin-left: 20px;
	border-radius: 100px;
`;

export default Setting;
