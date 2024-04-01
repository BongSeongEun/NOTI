/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import styled, {ThemeProvider} from "styled-components/native"
import React, { useState, useEffect } from 'react';
import {
	ScrollView,
	Text,
	Modal,
	Alert,
	TextInput,
	Button,
	TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import { decode } from 'base-64';
import axios from 'axios';

import images from "../components/images";
import Navigation_Bar from "../components/Navigation_Bar";
import { theme } from '../components/theme';

function Stat({ }) {
	const navigation = useNavigation();

	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');
	
	useEffect(() => {
		const fetchUserData = async () => {
			const token = await AsyncStorage.getItem('token');
  
			if (token) {
				const userId = getUserIdFromToken(token);
				try {
					const response = await axios.get(`http://15.164.151.130:4000/api/v1/userInfo/${userId}`, {
						headers: {
							'Authorization': `Bearer ${token}`,
						},
					});
					const userThemeName = response.data.userColor || 'OrangeTheme';
					const userProfileImage = response.data.userProfile;
					const nickname = response.data.userNickname;
  
					if (theme[userThemeName]) {
						setCurrentTheme(theme[userThemeName]);
					}
					setBase64Image(userProfileImage || '');
					setUserNickname(nickname || '');
				} catch (error) {
					console.error("Error fetching user data:", error);
				}
			}
		};
		fetchUserData();
	}, []);
	
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

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView>
				<MainView>
					<MainText>{userNickname} 님의 한 달</MainText>
					<MainText>노티 활동을 모아봤어요!</MainText>
				</MainView>
			</FullView>
		</ThemeProvider>
    );
}

const FullView = styled.View`
   width: 100%;
   background-color: white;
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
`;


export default Stat;