/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import styled, { ThemeProvider } from "styled-components/native";
import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import { decode } from 'base-64';
import axios from 'axios';
import { PieChart } from "react-native-gifted-charts";
import { ProgressCircle } from 'react-native-svg-charts';
import { Circle, G } from 'react-native-svg';

import Navigation_Bar from "../components/Navigation_Bar";
import { theme } from '../components/theme';

function Stat({ }) {
	const navigation = useNavigation();

	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');
	const [statData, setStatData] = useState({
        prevMonth: 0,
        difference: 0,
        thisMonth: 0
    });
	const [tagStats, setTagStats] = useState({
		Word1st: '',
		Word1stPercent: 0,
		Word2st: '',
		Word2stPercent: 0,
		Word3st: '',
		Word3stPercent: 0,
		Word4st: '',
		Word4stPercent: 0,
		etcPercent: 0
	});
	
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

	useEffect(() => {
        const fetchStats = async () => {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const userId = getUserIdFromToken(token);
            const statsDate = '2024.03';

            try {
                const response = await axios.get(`http://15.164.151.130:4000/api/v4/statsMonth/${userId}/${statsDate}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setStatData(response.data);
            } catch (error) {
                console.error("Error fetching stats data:", error);
            }
        };

        fetchStats();
	}, []);
	
	useEffect(() => {
		const fetchTagStats = async () => {
			const token = await AsyncStorage.getItem('token');
			if (!token) return;
	
			const userId = getUserIdFromToken(token);
			const statsDate = '2024.03';
	
			try {
				const response = await axios.get(`http://15.164.151.130:4000/api/v4/statsTag/${userId}/${statsDate}`, {
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});
				setTagStats(response.data);
			} catch (error) {
				console.error("Error fetching tag stats data:", error);
			}
		};
	
		fetchTagStats();
	}, []);

	const pieData = [
		{ id: tagStats.Word1st, value: tagStats.Word1stPercent, color: currentTheme.color1 },
		{ id: tagStats.Word2st, value: tagStats.Word2stPercent, color: currentTheme.color2 },
		{ id: tagStats.Word3st, value: tagStats.Word3stPercent, color: currentTheme.color3 },
		{ id: tagStats.Word4st, value: tagStats.Word4stPercent, color: currentTheme.color4 },
		{ id: '그 외', value: tagStats.etcPercent, color: currentTheme.color5 },
	];

	const RingChart = () => {
		const thisMonthValue = statData.thisMonth / 100;
		const prevMonthValue = statData.prevMonth / 100;
		const differenceValue = statData.difference / 100;
	
		const circleCoordinates = calculateCircleCoordinates(75, thisMonthValue, 100);
	
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
				<ProgressCircle
					style={{ height: 150, width: 150 }}
					progress={1}
					progressColor={'#E3E4E6'}
					backgroundColor={'transparent'}
					strokeWidth={15}
				/>
				<ProgressCircle
					style={{ height: 100, width: 100, position: 'absolute' }}
					progress={1}
					progressColor={'#E3E4E6'}
					backgroundColor={'transparent'}
					strokeWidth={15}
				/>
				<ProgressCircle
					style={{ height: 100, width: 100, position: 'absolute' }}
					progress={prevMonthValue}
					progressColor={'#B7BABF'}
					backgroundColor={'transparent'}
					strokeWidth={15}
				/>
				<ProgressCircle
					style={{ height: 150, width: 150, position: 'absolute' }}
					progress={thisMonthValue}
					progressColor={currentTheme.color1}
					backgroundColor={'transparent'}
					strokeWidth={15}
				/>
				<G x={circleCoordinates.x} y={circleCoordinates.y}>
					<Circle
						cx={0}
						cy={0}
						r="5"
						fill={differenceValue > 0 ? currentTheme.color2 : 'red'}
					/>
				</G>
			</View>
		);
	};
	
	function calculateCircleCoordinates(chartRadius, progressValue, chartDiameter) {
		const angle = 2 * Math.PI * progressValue;
		const x = chartRadius + chartDiameter * Math.sin(angle) - chartRadius;
		const y = chartRadius - chartDiameter * Math.cos(angle) - chartRadius;
		return { x, y };
	}
	

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
								<Text>지난 달: {statData.prevMonth}</Text>
								<Text>이번 달: {statData.thisMonth}</Text>
								<Text>차이: {statData.difference}</Text>
							</States>

							<States color={currentTheme.color2}>
								<Text>{tagStats.Word1st}: {tagStats.Word1stPercent}%</Text>
								<Text>{tagStats.Word2st}: {tagStats.Word2stPercent}%</Text>
								<Text>{tagStats.Word3st}: {tagStats.Word3stPercent}%</Text>
								<Text>{tagStats.Word4st}: {tagStats.Word4stPercent}%</Text>
								<Text>기타: {tagStats.etcPercent}%</Text>
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
							<RingChart />
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