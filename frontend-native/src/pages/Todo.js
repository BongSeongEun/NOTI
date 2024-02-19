/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';
import { useNavigation } from "@react-navigation/native";

import images from "../components/images";
import theme from '../components/theme';
import Navigation_Bar from "../components/Navigation_Bar";
import { format, parseISO } from "date-fns";
import { Calendar } from "react-native-calendars";
import TimeTable from "../components/TimeTable";

function Todo() {
	const navigation = useNavigation();
    const [events, setEvents] = useState([]);
    const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
    const [userNickname, setUserNickname] = useState('');
    const [markedDates, setMarkedDates] = useState({});
	const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);
	const [clicked_check, setClicked_check] = useState(Array(5).fill(false));
	const [schedule, setSchedule] = useState(Array(24 * 6).fill(false));

    useEffect(() => {
        fetchUserData();
    }, [selectedDate]);

	const formatDate = date => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = `0${d.getMonth() + 1}`.slice(-2); // 월은 0부터 시작하므로 1을 더함
		const day = `0${d.getDate()}`.slice(-2);
		return `${year}.${month}.${day}`;
	};
	
	const fetchUserData = async () => {
		const userId = await getUserIdFromToken();
		const formattedDate = formatDate(selectedDate);
	
		try {
		  const userResponse = await axios.get(`http://192.168.30.21:4000/api/v1/userInfo/${userId}`, {
			headers: {
			  'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
			},
		  });
	
		  if (userResponse.status === 200) {
			  const userThemeName = userResponse.data.userColor;
			  const userProfileImage = userResponse.data.userProfile;
					const nickname = userResponse.data.userNickname;
	
			if (theme[userThemeName]) {
			  setCurrentTheme(theme[userThemeName]);
			  setBase64Image(userProfileImage || ""); 
			  setUserNickname(nickname || ""); 
			  const eventsResponse = await axios.get(`http://192.168.30.21:4000/api/v1/getTodo/${userId}?date=${formattedDate}`, {
				headers: {
				  'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
				},
			  });
	
			  if (eventsResponse.status === 200) {
				const filteredEvents = eventsResponse.data.filter(event => event.todoDate === formattedDate);
				const updatedEvents = filteredEvents.map(event => ({
				  ...event,
				  selectedColor: theme[userThemeName][event.todoColor] || event.todoColor,
				}));
				  setEvents(updatedEvents);
				  updateMarkedDates(eventsResponse.data);
			  } else {
				console.error('Unexpected response:', eventsResponse);
			  }
			}
		  } else {
			console.error('Unexpected response:', userResponse);
		  }
		} catch (error) {
		  console.error('Error fetching user data and events:', error);
		}
	  };
	
	  const getUserIdFromToken = async () => {
		try {
		  const token = await AsyncStorage.getItem('token');
		  if (!token) return null;
	
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

    const onDayPress = (day) => {
        setSelectedDate(day.dateString);
    };

	const updateMarkedDates = (events) => {
		const newMarkedDates = {};
		events.forEach(event => {
			const eventDateFormatted = event.todoDate.replace(/\./g, '-');
			newMarkedDates[eventDateFormatted] = { marked: true, dotColor: currentTheme.color1 };
		});
		setMarkedDates(newMarkedDates);
	};

	const timeToIndex = time => {
		const [hours, minutes] = time.split(":").map(Number);
		return hours * 6 + Math.floor(minutes / 10);
	};

	const toggleComplete = async (todoId, index) => {
		const userId = await getUserIdFromToken();
		const newCompletedStatus = !events[index].todoDone;
		try {
			const response = await axios.put(
				`http://192.168.30.21:4000/api/v1/updateTodo/${userId}/${todoId}`,
				{
				...events[index],
				todoDone: newCompletedStatus,
				},
				{
				headers: {
					'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
				},
				}
			);

			if (response.status === 200) {
				const updatedEvents = events.map((event, evtIndex) =>
					evtIndex === index ? { ...event, todoDone: newCompletedStatus } : event
				);
				setEvents(updatedEvents);

				const startTimeIndex = timeToIndex(events[index].todoStartTime);
				const endTimeIndex = timeToIndex(events[index].todoEndTime);
				const newSchedule = schedule.map((slot, idx) => {
					if (idx >= startTimeIndex && idx < endTimeIndex) {
						return newCompletedStatus ? events[index].selectedColor : false;
					}
					return slot;
				});
				setSchedule(newSchedule);
			} else {
				console.error("Failed to update todo status:", response);
			}
		} catch (error) {
		  // Error during the request
		  console.error("Error updating todo status:", error);
		}
	};

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView>
				<MainView>
				<HorisontalView style={{marginTop: 20, marginBottom: 10}}>
						<Profile source={{ uri: `data:image/png;base64,${base64Image}` }} style={{ marginTop: 20 }} />
						<ProfileTextContainer>
							<MainText>{userNickname} 님,</MainText>
							<MainText style={{ color: currentTheme.color1 }}>
								{format(new Date(selectedDate), "yyyy.MM.dd")} 노티입니다!
							</MainText>
						</ProfileTextContainer>
					</HorisontalView>
				</MainView>
			</FullView>
			
			<FullView style={{flex: 1}}>
				<BarContainer>
					<MainText style={{ marginRight: 20 }}>나의 일정</MainText>
                    <MainText onPress={() => navigation.navigate('Coop_M')}style={{ marginLeft: 20 }}>협업 일정</MainText>
                </BarContainer>
				<Bar />
				<Bar_Mini />

				<ScrollView>
					<MainView>
						<HorisontalView style={{ justifyContent: 'space-between', padding: 20}}>
						<images.calendar width={20} height={20}
						color={clicked_calendar ? currentTheme.color1 : "#B7BABF"}
						onPress={() => setClicked_calendar(!clicked_calendar)} />
						<images.share width={20} height={20}
						color={clicked_share ? currentTheme.color1 : "#B7BABF"}
								onPress={() => setClicked_share(!clicked_share)} />
						</HorisontalView>

						{clicked_calendar && (
							<>
								<Calendar
									onDayPress={onDayPress}
									markedDates={{
										...markedDates,
										[selectedDate]: { ...markedDates[selectedDate], selected: true, selectedColor: currentTheme.color1 },
									}}
								/>
							</>
						)}
						
						{events.map((event, index) => (
							<Noti key={event.todoId}
							style={{
								backgroundColor: event.selectedColor,
								}}>
								<Noti_Check onPress={() => toggleComplete(event.todoId, index)}>
									{event.todoDone && <images.noticheck width={15} height={15}
										color={event.selectedColor} /> }
								</Noti_Check>
								<NotiTextContainer>
									<NotiText>{event.todoTitle}</NotiText>
									<NotiText>{`${event.todoStartTime} ~ ${event.todoEndTime}`}</NotiText>
								</NotiTextContainer>
								
							</Noti>
						))}

						<TimeTable schedule={schedule} />
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


const ProfileContainer = styled.View`
    display: flex;
    flex-direction: row;
`;

const BarContainer = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;
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

const MainText = styled.Text`
    font-size: ${props => props.fontSize || "12px"};
    font-weight: bold;
    color: ${props => props.color || "black"};
    text-align: left;
`;

const Bar = styled.View`
    width: 100%;
    height: 1px;
    margin-top: 10px;
    background-color: #B7BABF;
`;

const Bar_Mini = styled(Bar)`
    align-self: flex-start;
    width: 50%;
    height: 2px;
    background-color: ${props => props.theme.color1};
    margin-top: 0px;
`;

const NotiTextContainer = styled.View`
    flex: 1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-right: 20px;
`;

const Noti = styled.TouchableOpacity`
	width: 300px;
	height: 40px;
	border-radius: 15px;
	background-color: ${props => props.color || "#FF7154"};
	flex-direction: row;
	align-items: center;
	margin: 5px;
`;

const Noti_Check = styled.TouchableOpacity`
	width: 25px;
	height: 25px;
	border-radius: 100px;
	background-color: white;
	margin-left: 10px;
	justify-content: center;
	align-items: center;
`;

const NotiText = styled.Text`
	font-size: 13px;
	font-weight: normal;
	color: ${props => props.color || "white"};
	text-align: left;
	margin-left: 10px;
`;

export default Todo;
