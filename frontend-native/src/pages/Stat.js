/* eslint-disable quotes */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */

import styled, { ThemeProvider } from "styled-components/native";
import React, { useState, useEffect } from 'react';
import {
	ScrollView,
	Text,
	View,
	TouchableOpacity,
} from "react-native";
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
import DropDownPicker from 'react-native-dropdown-picker'

function Stat({ }) {
	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
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
		thisMonth: 0,
	});
	const [tagStats, setTagStats] = useState({
		Word1st: '', Word1stPercent: 0, Word1stNum: 0, Word1stDoneTodos: 0, Word1stTime: 0,
		Word2st: '', Word2stPercent: 0, Word2stNum: 0, Word2stDoneTodos: 0, Word2stTime: 0,
		Word3st: '', Word3stPercent: 0, Word3stNum: 0, Word3stDoneTodos: 0, Word3stTime: 0,
		Word4st: '', Word4stPercent: 0, Word4stNum: 0, Word4stDoneTodos: 0, Word4stTime: 0,
		etcPercent: 0,
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

	const [goal, setGoal] = useState({ schedule: '', time: '', rate: '' });
	const [initialGoal, setInitialGoal] = useState({ schedule: '', time: '', rate: '' });
	const [isGoalChanged, setIsGoalChanged] = useState(false);
	const [recommendedGoals, setRecommendedGoals] = useState([]);
	const [showRecommendedGoals, setShowRecommendedGoals] = useState(false);
	const handleScheduleChange = (text) => setGoal(prev => ({ ...prev, schedule: text }));
	const handleTimeChange = (text) => setGoal(prev => ({ ...prev, time: text }));
	const [isGoalSet, setIsGoalSet] = useState(false);
	const [goalPercent, setGoalPercent] = useState(0);
	const [open, setOpen] = useState(false);
	const [items, setItems] = useState([
		{ label: '2024.05', value: '2024.05' },
		{ label: '2024.04', value: '2024.04' },
		{ label: '2024.03', value: '2024.03' },
		{ label: '2024.02', value: '2024.02' },
		{ label: '2024.01', value: '2024.01' },
	]);
	const [value, setValue] = useState(items[0].value);
	const [summaryResult, setSummaryResult] = useState('');

	
	/*
		>> API
	*/

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
					const nickname = response.data.userNickname;
  
					if (theme[userThemeName]) {
						setCurrentTheme(theme[userThemeName]);
					}
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
			const statsDate = value;

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

		if (value) {
			fetchStats();
		}
	}, [value]);
	
	useEffect(() => {
		const fetchTagStats = async () => {
			const token = await AsyncStorage.getItem('token');
			if (!token) return;
	
			const userId = getUserIdFromToken(token);
			const statsDate = value;
	
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
	
		if (value) {
			fetchTagStats();
		}
	}, [value]);

	useEffect(() => {
		const fetchDayWeekStats = async () => {
			const token = await AsyncStorage.getItem('token');
			if (!token) return;
	  
			const userId = getUserIdFromToken(token);
			const statsDate = value;
	  
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
	  
		if (value) {
			fetchDayWeekStats();
		}
	}, [value]);

	const saveGoalToServer = async () => {
		const token = await AsyncStorage.getItem('token');
		if (!token) {
			console.error("Token not available");
			return;
		}
	  
		const userId = getUserIdFromToken(token);
		const statsDate = value;
		const url = `http://15.164.151.130:4000/api/v4/GoalWrite/${userId}/${statsDate}`;
	  
		const headers = {
			'Authorization': `Bearer ${token}`,
			'Content-Type': 'application/json',
		};
	  
		const data = {
			goalTitle: goal.schedule,
			goalTime: goal.time,
			goalAchieveRate: goal.rate,
		};
	  
		try {
			const response = await axios.post(url, data, { headers });
			if (response.status === 200) {
				console.log("Goal saved successfully:", response.data);
				setInitialGoal(goal);
				setIsGoalChanged(false);
				fetchCurrentGoalRate();
			} else {
				console.error(`Unexpected status code: ${response.status}`);
			}
		} catch (error) {
			console.error("Error saving goal:", error);
		}
	};
	
	useEffect(() => {
		const fetchRecommendedGoals = async () => {
			const token = await AsyncStorage.getItem('token');
			if (!token) return;
	
			const userId = getUserIdFromToken(token);
			const statsDate = value;
	
			try {
				const response = await axios.get(`http://15.164.151.130:4000/api/v4/suggestGoal/${userId}/${statsDate}`, {
					headers: {
						'Authorization': `Bearer ${token}`,
					},
				});
				console.log("Response Data:", response.data);
				
				if (response.data.goalTitle) {
					setIsGoalSet(true);
					setGoal({
						schedule: response.data.goalTitle,
						time: response.data.goalTime.toString(),
					});
					setInitialGoal({
						schedule: response.data.goalTitle,
						time: response.data.goalTime.toString(),
					});
					setIsGoalChanged(false);
				}
	
				setRecommendedGoals([
					{
						title: response.data.suggestGoalTitle1,
						time: response.data.suggestGoalTime1,
					},
					{
						title: response.data.suggestGoalTitle2,
						time: response.data.suggestGoalTime2,
					},
					{
						title: response.data.suggestGoalTitle3,
						time: response.data.suggestGoalTime3,
					},
				]);
			} catch (error) {
				console.error("Error fetching recommended goals:", error);
			}
		};
	
		if (value) {
			fetchRecommendedGoals();
		}
	}, [value]);

	const fetchCurrentGoalRate = async () => {
		const token = await AsyncStorage.getItem('token');
		if (!token) {
			console.error("Token not available");
			return;
		}
	  
		const userId = getUserIdFromToken(token);
		const statsDate = value;
	  
		try {
			const response = await axios.get(`http://15.164.151.130:4000/api/v4/currentGoal/${userId}/${statsDate}`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});
	  
			if (response.data && response.data.currentGoalRate !== undefined) {
				setGoalPercent(response.data.currentGoalRate);
			}
		} catch (error) {
			console.error("Error fetching current goal rate:", error);
		}
	};

	const fetchSummary = async () => {
		const token = await AsyncStorage.getItem('token');
		if (!token) {
			console.error("Token not available");
			return;
		}
	
		const userId = getUserIdFromToken(token);
		const statsDate = value;
	
		try {
			const response = await axios.get(`http://15.164.151.130:4000/api/v4/summary/${userId}/${statsDate}`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});
	
			if (response.data && response.data.summaryResult) {
				setSummaryResult(response.data.summaryResult);
			}
		} catch (error) {
			console.error("Error fetching summary data:", error);
		}
	};

	useEffect(() => {
		fetchCurrentGoalRate();
		fetchSummary();
	}, [value]);


	/*
		>> 함수
	*/

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

	const toggleRecommendedGoals = () => {
		setShowRecommendedGoals(!showRecommendedGoals);
	};

	const handleSelectRecommendedGoal = (selectedGoal) => {
		setGoal({
			schedule: selectedGoal.title,
			time: selectedGoal.time.toString(),
		});
		setShowRecommendedGoals(false);
		setIsGoalSet(true);
	};

	const toggleDropDown = () => {
		setOpen(!open);
	};

	useEffect(() => {
		setIsGoalChanged(
			goal.schedule !== initialGoal.schedule ||
			goal.time !== initialGoal.time ||
			goal.rate !== initialGoal.rate
		);
	}, [goal, initialGoal]);

	const renderStates = () => {
		const statesData = [
			{
				color: currentTheme.color1,
				text: `${userNickname} 님의 가장 많은 노티는`,
				word: tagStats.Word1st,
				num: tagStats.Word1stNum,
				doneTodos: tagStats.Word1stDoneTodos,
				percent: tagStats.Word1stPercent
			},
			{
				color: currentTheme.color2,
				text: `${userNickname} 님의 2번째 많은 노티는`,
				word: tagStats.Word2st,
				num: tagStats.Word2stNum,
				doneTodos: tagStats.Word2stDoneTodos,
				percent: tagStats.Word2stPercent
			},
			{
				color: currentTheme.color3,
				text: `${userNickname} 님의 3번째 많은 노티는`,
				word: tagStats.Word3st,
				num: tagStats.Word3stNum,
				doneTodos: tagStats.Word3stDoneTodos,
				percent: tagStats.Word3stPercent
			},
			{
				color: currentTheme.color4,
				text: `${userNickname} 님의 4번째 많은 노티는`,
				word: tagStats.Word4st,
				num: tagStats.Word4stNum,
				doneTodos: tagStats.Word4stDoneTodos,
				percent: tagStats.Word4stPercent
			},
			{
				color: currentTheme.color5,
				text: `이번 달의 한줄평은`,
				summary: summaryResult || "데이터가 없습니다.",
			},
		];
	
		return statesData.map((state, index) => (
			<States key={index} color={state.color} style={{ padding: 10 }}>
				<View>
					<MainText color='white'>{state.text}</MainText>
					{state.word ? (
						<>
							<MainText color='white'>{state.word}로 {state.num}개의 노티 중 {state.doneTodos}개를 달성했어요!</MainText>
							<Stat_Text style={{ marginTop: 5 }}>전체 중 {state.percent}% 입니다!</Stat_Text>
						</>
					) : (
						<Stat_Text style={{ marginTop: 5 }}>{state.summary}</Stat_Text>
					)}
				</View>
			</States>
		));
	};


	/*
		>> RETURN문
	*/

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView style={{ flex: 1, marginBottom: 80 }}>
				<ScrollView>
					<MainView>
						<MainText style={{ fontSize: 15, marginTop: 50, }}>{userNickname} 님의 한 달</MainText>
						<MainText style={{ fontSize: 15, marginBottom: 15 }}>노티 활동을 모아봤어요!</MainText>

						<TouchableOpacity onPress={toggleDropDown} style={{ marginBottom: 5 }} />

						<DropDownPicker
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
						/>

						<ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
							{renderStates()}
						</ScrollView>

						<GoalFrame color={currentTheme.color1} isGoalChanged={isGoalChanged} isGoalSet={isGoalSet}>
							<GoalB>
								<MainText style={{ color: "white" }}>이번 달의 목표 🔥</MainText>
							</GoalB>
							<View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center' }}>
								<StyledTextInput
									onChangeText={handleScheduleChange}
									value={goal.schedule}
									placeholder="일정"
									keyboardType="default"
								/>
								<MainText style={{ marginRight: 10, fontSize: 13 }}>일정</MainText>
								<StyledTextInput
									onChangeText={handleTimeChange}
									value={goal.time}
									placeholder="시간"
									keyboardType="numeric"
								/>
								<MainText style={{ marginRight: 10, fontSize: 13 }}>분</MainText>
								<MainText>달성하기!</MainText>
							</View>

							{isGoalSet && (
								<View style={{ marginTop: 10, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', width: 265 }}>
									<View style={{ flexDirection: 'row', backgroundColor: 'transparent' }}>
										<GoalChart />
										<GoalChart style={{ backgroundColor: currentTheme.color1, width: `${goalPercent}%`, position: 'absolute' }} />
									</View>
									<MainText>{goalPercent}%</MainText>
								</View>
							)}

							<TouchableOpacity onPress={toggleRecommendedGoals} style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
								<MainText>추천 목표 보기</MainText>
								<images.creat_down
									width={20}
									height={20}
									style={{
										transform: [{ rotate: showRecommendedGoals ? '180deg' : '0deg' }],
										color: showRecommendedGoals ? currentTheme.color1 : "#B7BABF",
									}}
								/>
							</TouchableOpacity>

							{showRecommendedGoals && (
								<View style={{ marginTop: 10 }}>
									{recommendedGoals.map((goal, index) => (
										<TouchableOpacity key={index} onPress={() => handleSelectRecommendedGoal(goal)}>
											<MainText style={{ padding: 5, color: 'gray' }}>
												{goal.title} 일정 {goal.time} 분 달성하기!
											</MainText>
										</TouchableOpacity>
									))}
								</View>
							)}

							{isGoalChanged && (
								<TouchableOpacity onPress={saveGoalToServer} style={{ padding: 10, backgroundColor: currentTheme.color1, borderRadius: 5, marginTop: 10 }}>
									<MainText style={{ textAlign: 'center', color: 'white' }}>목표 저장하기</MainText>
								</TouchableOpacity>
							)}
						</GoalFrame>
					
						<HorisontalView style={{ justifyContent: 'space-between', marginTop: 25 }}>
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

							<View style={{ position: 'absolute', top: 85, left: 20 }}>
								<HorisontalView style={{ width: 100, marginTop: 2 }}>
									<Stat_Label color={currentTheme.color1} />
									<Text style={{ fontSize: 10 }}>{tagStats.Word1st} - {tagStats.Word1stTime}분</Text>
								</HorisontalView>
								<HorisontalView style={{ width: 100, marginTop: 2 }}>
									<Stat_Label color={currentTheme.color2} />
									<Text style={{ fontSize: 10 }}>{tagStats.Word2st} - {tagStats.Word2stTime}분</Text>
								</HorisontalView>
								<HorisontalView style={{ width: 100, marginTop: 2 }}>
									<Stat_Label color={currentTheme.color3} />
									<Text style={{ fontSize: 10 }}>{tagStats.Word3st} - {tagStats.Word3stTime}분</Text>
								</HorisontalView>
								<HorisontalView style={{ width: 100, marginTop: 2 }}>
									<Stat_Label color={currentTheme.color4} />
									<Text style={{ fontSize: 10 }}>{tagStats.Word4st} - {tagStats.Word4stTime}분</Text>
								</HorisontalView>
								<HorisontalView style={{ width: 100, marginTop: 2 }}>
									<Stat_Label color={currentTheme.color5} />
									<Text style={{ fontSize: 10 }}>그 외</Text>
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
									{statData.difference >= 0 ? (
										<MainText>지난 달 이맘때보다 {'\n'} {statData.difference}% 늘었어요!</MainText>
									) : (
										<MainText>지난 달 이맘때보다 {'\n'} {Math.abs(statData.difference)}% 줄었어요!</MainText>
									)}
								</View>

								<View style={{ alignItems: 'center', justifyContent: 'center' }}>
									<RingChart
										animate={true}
										animationDuration={800}
									/>
									<View style={{ position: 'absolute' }}>
										<Text style={{ fontSize: 10, color: 'black' }}>이번 달 달성률</Text>
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
	flex-wrap: wrap;
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

const GoalFrame = styled.TouchableOpacity`
	width: 300px;
	height: ${props => props.isGoalChanged ? (props.isGoalSet ? 'auto' : '130px') : (props.isGoalSet ? 'auto' : '110px')};
	border-radius: 15px;
	border-width: 1px;
	border-color: ${props => props.color || "#B7BABF"};
	padding: 15px;
	margin-top: 20px;
`;

const StyledTextInput = styled.TextInput`
  height: 40px;
  border-width: 0;
  border-radius: 5px;
  margin: 3px;
  background-color: white;
  font-size: 13px;
`;

const GoalChart = styled.TouchableOpacity`
	width: 230px;
	height: 20px;
	border-radius: 100px;
	background-color: ${props => props.color || "#E3E4E6"};
`;

const GoalB = styled.TouchableOpacity`
	width: 180px;
	height: 30px;
	border-radius: 15px;
	background-color: ${props => props.theme.color1 || "white"};
	align-items: center;
	justify-content: center;
	align-self: center;
	position: absolute;
	top: -15px;
`;

export default Stat;