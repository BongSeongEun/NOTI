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
import { PieChart } from "react-native-gifted-charts";

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

	const pieData = [
		{ id: 'data1', value: 50, color: currentTheme.color1 },
		{ id: 'data2', value: 40, color: currentTheme.color2 },
		{ id: 'data3', value: 20, color: currentTheme.color3 },
		{ id: 'data4', value: 25, color: currentTheme.color4 },
		{ id: 'data5', value: 15, color: currentTheme.color5 },
	];

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView>
				<ScrollView>
					<MainView>
						<MainText>{userNickname} 님의 한 달</MainText>
						<MainText>노티 활동을 모아봤어요!</MainText>

						<MainText>기간 선택</MainText>

						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={true}
						>
							<States color={currentTheme.color1}>
								<MainText>통계1</MainText>
							</States>

							<States color={currentTheme.color2}>
								<MainText>통계2</MainText>
							</States>
						</ScrollView>
					
						<MainText>상세 리포트</MainText>

						<StatFrame>
							<MainText>통계자료</MainText>
							<PieChart
								data={pieData}
								showText
								textColor="black"
								radius={80}
								textSize={10}
								focusOnPress
								showValuesAsLabels
							/>
						</StatFrame>

						<StatFrame>
							<MainText>통계자료</MainText>
						</StatFrame>

					</MainView>
				</ScrollView>
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

const States = styled.TouchableOpacity`
	width: 290px;
	height: 100px;
	border-radius: 15px;
	background-color: ${props => props.color || "#FF7154"};
	flex-direction: row;
	align-items: center;
	margin: 5px;
`;

const StatFrame = styled.TouchableOpacity`
	width: 300px;
	height: 200px;
	border-radius: 15px;
	border-width: 1px;
	border-color: #B7BABF;
`;

export default Stat;