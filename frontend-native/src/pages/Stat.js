/* eslint-disable react-native/no-inline-styles */
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
import { PieChart, BarChart } from "react-native-gifted-charts";
import { ProgressCircle } from 'react-native-svg-charts';
import { Circle, G } from 'react-native-svg';

import images from "../components/images";
import Navigation_Bar from "../components/Navigation_Bar";
import { theme } from '../components/theme';

function Stat({ }) {
	const navigation = useNavigation();

	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');
	const [dailyCompletionRates, setDailyCompletionRates] = useState({
		MON: 0, TUE: 0, WED: 0, THU: 0, FRI: 0, SAT: 0, SUN: 0,
	});
	const [highestDay, setHighestDay] = useState('');
	const [expandedStates, setExpandedStates] = useState({
		statFrame1: false,
		statFrame2: false,
	});
	const [clicked_share, setClicked_share] = useState(false);
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

	const [barDataDay, setBarDataDay] = useState([
		{ value: dailyCompletionRates.SUN, label: '일', frontColor: "#B7BABF" },
		{ value: dailyCompletionRates.MON, label: '월', frontColor: "#B7BABF" },
		{ value: dailyCompletionRates.TUE, label: '화', frontColor: "#B7BABF" },
		{ value: dailyCompletionRates.WED, label: '수', frontColor: "#B7BABF" },
		{ value: dailyCompletionRates.THU, label: '목', frontColor: "#B7BABF" },
		{ value: dailyCompletionRates.FRI, label: '금', frontColor: "#B7BABF" },
		{ value: dailyCompletionRates.SAT, label: '토', frontColor: "#B7BABF" },
	]);
	
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

	useEffect(() => {
		const fetchDayWeekStats = async () => {
			const token = await AsyncStorage.getItem('token');
			if (!token) return;
	  
			const userId = getUserIdFromToken(token);
			const statsDate = '2024.03';
	  
			try {
				const response = await axios.get(`http://15.164.151.130:4000/api/v4/dayWeek/${userId}/${statsDate}`, {
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});
	  
				const stats = response.data;
				const newDailyCompletionRates = {
					MON: calculateCompletionRate(stats.MONtotalTodos, stats.MONdoneTodos),
					TUE: calculateCompletionRate(stats.TUEtotalTodos, stats.TUEdoneTodos),
					WED: calculateCompletionRate(stats.WEDtotalTodos, stats.WEDdoneTodos),
					THU: calculateCompletionRate(stats.THUtotalTodos, stats.THUdoneTodos),
					FRI: calculateCompletionRate(stats.FRItotalTodos, stats.FRIdoneTodos),
					SAT: calculateCompletionRate(stats.SATtotalTodos, stats.SATdoneTodos),
					SUN: calculateCompletionRate(stats.SUNtotalTodos, stats.SUNdoneTodos),
				};
			
				setDailyCompletionRates(newDailyCompletionRates);
			} catch (error) {
				console.error("Error fetching day week stats data:", error);
			}
		};
	  
		fetchDayWeekStats();
	}, []);

	const pieData = [
		{ id: tagStats.Word1st, value: tagStats.Word1stPercent, color: currentTheme.color1, focused: true },
		{ id: tagStats.Word2st, value: tagStats.Word2stPercent, color: currentTheme.color2 },
		{ id: tagStats.Word3st, value: tagStats.Word3stPercent, color: currentTheme.color3 },
		{ id: tagStats.Word4st, value: tagStats.Word4stPercent, color: currentTheme.color4 },
		{ id: '그 외', value: tagStats.etcPercent, color: currentTheme.color5 },
	];

	const barData = [
		{ value: tagStats.Word1stPercent, frontColor: currentTheme.color1 },
		{ value: tagStats.Word2stPercent, frontColor: currentTheme.color2 },
		{ value: tagStats.Word3stPercent, frontColor: currentTheme.color3 },
		{ value: tagStats.Word4stPercent, frontColor: currentTheme.color4 },
		{ value: tagStats.etcPercent, frontColor: currentTheme.color5 },
	];

	const barData_Day = [
		{ value: dailyCompletionRates.SUN, label: '일', frontColor: "#B7BABF" },
		{ value: dailyCompletionRates.MON, label: '월', frontColor: "#B7BABF" },
		{ value: dailyCompletionRates.TUE, label: '화', frontColor: "#B7BABF"},
		{ value: dailyCompletionRates.WED, label: '수', frontColor: "#B7BABF"},
		{ value: dailyCompletionRates.THU, label: '목', frontColor: "#B7BABF"},
		{ value: dailyCompletionRates.FRI, label: '금', frontColor: "#B7BABF"},
		{ value: dailyCompletionRates.SAT, label: '토', frontColor: "#B7BABF"},
	];

	const calculateCompletionRate = (total, done) => {
		let rate = total > 0 ? Math.floor((done / total) * 100) : 0;
		return rate === 0 ? 5 : rate;
	};

	useEffect(() => {
		const dayCompletionRates = [
			{ day: 'MON', rate: dailyCompletionRates.MON },
			{ day: 'TUE', rate: dailyCompletionRates.TUE },
			{ day: 'WED', rate: dailyCompletionRates.WED },
			{ day: 'THU', rate: dailyCompletionRates.THU },
			{ day: 'FRI', rate: dailyCompletionRates.FRI },
			{ day: 'SAT', rate: dailyCompletionRates.SAT },
			{ day: 'SUN', rate: dailyCompletionRates.SUN },
		];
	
		const highestDayRate = dayCompletionRates.reduce((max, day) => day.rate > max.rate ? day : max, { rate: 0 });
		
		const updatedBarData_Day = dayCompletionRates.map(day => ({
			value: day.rate,
			label: dayLabel(day.day),
			frontColor: day.day === highestDayRate.day ? currentTheme.color1 : "#B7BABF",
		}));
	
		setBarDataDay(updatedBarData_Day);
		setHighestDay(dayLabel(highestDayRate.day));
	}, [dailyCompletionRates, currentTheme]);

	const dayLabel = (dayCode) => {
		const labels = { MON: '월', TUE: '화', WED: '수', THU: '목', FRI: '금', SAT: '토', SUN: '일' };
		return labels[dayCode] || '';
	};

	const RingChart = () => {
		const thisMonthValue = statData.thisMonth / 100;
		const prevMonthValue = statData.prevMonth / 100;
		const differenceValue = statData.difference / 100;
	
		const circleCoordinates = calculateCircleCoordinates(75, thisMonthValue, 100);
	
		return (
			<View style={{ justifyContent: 'center', alignItems: 'center' }}>
				<ProgressCircle
					style={{ height: 150, width: 150 }}
					progress={1}
					progressColor={'#E3E4E6'}
					backgroundColor={'transparent'}
					strokeWidth={10}
				/>
				<ProgressCircle
					style={{ height: 115, width: 115, position: 'absolute' }}
					progress={1}
					progressColor={'#E3E4E6'}
					backgroundColor={'transparent'}
					strokeWidth={10}
				/>
				<ProgressCircle
					style={{ height: 115, width: 115, position: 'absolute' }}
					progress={prevMonthValue}
					progressColor={'#B7BABF'}
					backgroundColor={'transparent'}
					strokeWidth={10}
				/>
				<ProgressCircle
					style={{ height: 150, width: 150, position: 'absolute' }}
					progress={thisMonthValue}
					progressColor={currentTheme.color1}
					backgroundColor={'transparent'}
					strokeWidth={10}
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
	
	const toggleExpanded = (frameKey) => {
		setExpandedStates(prevState => ({
			...prevState,
			[frameKey]: !prevState[frameKey],
		}));
	};

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView style={{ flex: 1, marginBottom: 80 }}>
				<ScrollView>
					<MainView>
						<MainText style={{ fontSize: 15, marginTop: 50 }}>{userNickname} 님의 한 달</MainText>
						<MainText style={{ fontSize: 15, marginBottom: 15 }}>노티 활동을 모아봤어요!</MainText>

						<MainText style={{ marginBottom: 5 }}>기간 선택</MainText>

						<ScrollView
							horizontal={true}
							showsHorizontalScrollIndicator={true}
						>
							<States color={currentTheme.color1}
								style={{ padding: 10 }}
							>
								<View>
									<MainText color='white'>{userNickname} 님의 가장 많은 노티는</MainText>
									<MainText color='white'>{tagStats.Word1st}로 00개의 노티 중 00개를 달성했어요!</MainText>
									<Stat_Text style={{ marginTop: 5 }}>전체 중 {tagStats.Word1stPercent}% 입니다!</Stat_Text>
								</View>
							</States>

							<States color={currentTheme.color2}
								style={{ padding: 10 }}
							>
								<View>
									<MainText color='white'>{userNickname} 님의 2번째 많은 노티는</MainText>
									<MainText color='white'>{tagStats.Word2st}로 00개의 노티 중 00개를 달성했어요!</MainText>
									<Stat_Text style={{ marginTop: 5 }}>전체 중 {tagStats.Word2stPercent}% 입니다!</Stat_Text>
								</View>
							</States>

							<States color={currentTheme.color3}
								style={{ padding: 10 }}
							>
								<View>
									<MainText>3</MainText>
								</View>
							</States>

							<States color={currentTheme.color4}
								style={{ padding: 10 }}
							>
								<View>
									<MainText>4</MainText>
								</View>
							</States>

							<States color={currentTheme.color5}
								style={{ padding: 10 }}
							>
								<View>
									<MainText>5</MainText>
								</View>
							</States>
						</ScrollView>
					
						<HorisontalView style={{ justifyContent: 'space-between', marginTop: 25, marginBottom: 10 }}>
							<MainText style={{ fontSize: 15 }}>상세 리포트</MainText>
							<images.share width={20} height={20}
								color={clicked_share ? currentTheme.color1 : "#B7BABF"}
								onPress={() => setClicked_share(!clicked_share)} />
						</HorisontalView>
						

						<StatFrame style={{ marginTop: 10, height: expandedStates.statFrame1 ? 380 : 200, }}>
							<HorisontalView style={{ width: 270, justifyContent: 'space-between' }}>
								<View>
									<MainText>{userNickname} 님의</MainText>
									<MainText>{tagStats.Word1st} 일정이 전체 일정의</MainText>
									<MainText>{tagStats.Word1stPercent}% 를 차지했어요!</MainText>
								</View>
							
								<View style={{ marginRight: 20 }}>
									<PieChart
										data={pieData}
										showText
										textColor="white"
										radius={70}
										textSize={10}
										focusOnPress
										showValuesAsLabels
									/>
								</View>
							</HorisontalView>

							<View style={{ position: 'absolute', marginTop: 85, alignSelf: 'flex-start', marginLeft: 20 }}>
								<HorisontalView style={{ width: 'auto', marginTop: 2 }}>
									<Stat_Label color={currentTheme.color1} />
									<Text style={{ fontSize: 10 }}>{tagStats.Word1st} - {tagStats.Word1stPercent}%</Text>
								</HorisontalView>
								<HorisontalView style={{ width: 'auto', marginTop: 2 }}>
									<Stat_Label color={currentTheme.color2} />
									<Text style={{ fontSize: 10 }}>{tagStats.Word2st} - {tagStats.Word2stPercent}%</Text>
								</HorisontalView>
								<HorisontalView style={{ width: 'auto', marginTop: 2 }}>
									<Stat_Label color={currentTheme.color3} />
									<Text style={{ fontSize: 10 }}>{tagStats.Word3st} - {tagStats.Word3stPercent}%</Text>
								</HorisontalView>
								<HorisontalView style={{ width: 'auto', marginTop: 2 }}>
									<Stat_Label color={currentTheme.color4} />
									<Text style={{ fontSize: 10 }}>{tagStats.Word4st} - {tagStats.Word4stPercent}%</Text>
								</HorisontalView>
								<HorisontalView style={{ width: 'auto', marginTop: 2 }}>
									<Stat_Label color={currentTheme.color5} />
									<Text style={{ fontSize: 10 }}>그 외 - {tagStats.etcPercent}%</Text>
								</HorisontalView>
							</View>

							{expandedStates.statFrame1 && (
								<>
									<View style={{ transform: [{ rotate: '90deg' }], width: 'auto', height: 150, marginTop: 20, marginLeft: 10, marginBottom: 20 }}>
										<BarChart
											data={barData}
											hideYAxis
											hideGrid
											fromZero
											barWidth={20}
											hideAxesAndRules={true}
											noOfSections={5}
											barBorderRadius={10}
											isAnimated
											animationDuration={500}
											spacing={10}
											frontColor={currentTheme.color1}
											chartConfig={{
												backgroundGradientFromOpacity: 0,
												backgroundGradientToOpacity: 0,
											}}
											style={{
												marginVertical: 8,
												borderRadius: 16,
											}}
										/>
									</View>
									
								</>
							)}

							<images.creat_down
								width={20}
								height={20}
								style={{
									alignSelf: 'center',
									position: 'absolute',
									bottom: 10,
									transform: [{ rotate: expandedStates.statFrame1 ? '180deg' : '0deg' }],
									color: expandedStates.statFrame1 ? currentTheme.color1 : "#B7BABF",
								}}
								onPress={() => toggleExpanded('statFrame1')}
							/>
						</StatFrame>

						<StatFrame style={{ marginTop: 10, height: expandedStates.statFrame2 ? 500 : 200, }}>
							<HorisontalView style={{ width: 270, justifyContent: 'space-between' }}>
								<View style={{ marginTop: 20 }}>
									<MainText>전체 노티의 달성률이</MainText>
									<MainText>지난 달 이맘때보다</MainText>
									<MainText>{statData.difference}% 늘었어요!</MainText>
								</View>
								<View style={{ alignItems: 'center', justifyContent: 'center' }}>
									<RingChart
										animate={true}
										animationDuration={800}
									/>
									<View style={{ position: 'absolute' }}>
										<Text style={{ fontSize: 10, color: 'balck' }}>이번 달 달성률</Text>
										<Text style={{ fontSize: 10, color: currentTheme.color1, alignSelf: 'center' }}>{statData.thisMonth}%</Text>
									</View>
								</View>
							</HorisontalView>
							<View style={{ position: 'absolute', marginTop: 120, alignSelf: 'flex-start', marginLeft: 20 }}>
								<HorisontalView style={{ width: 'auto', marginTop: 2 }}>
									<Stat_Label color={currentTheme.color1} />
									<Text style={{ fontSize: 10 }}>이번 달 달성률</Text>
								</HorisontalView>
								<HorisontalView style={{ width: 'auto', marginTop: 2 }}>
									<Stat_Label color={'#B7BABF'} />
									<Text style={{ fontSize: 10 }}>저번 달 달성률</Text>
								</HorisontalView>
							</View>

							{expandedStates.statFrame2 && (
								<>
									<View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 20 }}>
										<MainText>이번 달은 </MainText>
										<MainText style={{ color: currentTheme.color1 }}>{highestDay}요일 </MainText>
										<MainText>달성률이 가장 높아요!</MainText>
									</View>
									
									<View style={{ width: 'auto', height: 80, marginBottom: 20, marginLeft: -15 }}>
										<BarChart
											data={barDataDay}
											hideYAxis
											hideGrid
											fromZero
											barWidth={20}
											hideAxesAndRules={true}
											noOfSections={5}
											barBorderRadius={10}
											isAnimated
											animationDuration={500}
											spacing={10}
											frontColor={currentTheme.color1}
											chartConfig={{
												backgroundGradientFromOpacity: 0,
												backgroundGradientToOpacity: 0,
											}}
											style={{
												marginVertical: 8,
												borderRadius: 16,
											}}
										/>
										
									</View>
								</>
							)}

							<images.creat_down
								width={20}
								height={20}
								style={{
									alignSelf: 'center',
									position: 'absolute',
									bottom: 10,
									transform: [{ rotate: expandedStates.statFrame2 ? '180deg' : '0deg' }],
									color: expandedStates.statFrame2 ? currentTheme.color1 : "#B7BABF",
								}}
								onPress={() => toggleExpanded('statFrame2')}
							/>
						</StatFrame>

					</MainView>
				</ScrollView>
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
	padding: 20px;
`;

const Stat_Text = styled.Text`
	font-size: 10px;
	color: white;
	font-weight: normal;
`;

const Stat_Label = styled.TouchableOpacity`
	width: 10px;
	height: 10px;
	border-radius: 50px;
	background-color: ${props => props.color || "#FF7154"};
	margin-right: 5px;
`;

export default Stat;