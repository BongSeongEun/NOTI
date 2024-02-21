/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */

import styled, {ThemeProvider} from "styled-components/native"
import React, { useState, useEffect } from 'react';
import { ScrollView,  } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';

import { theme } from "../components/theme";
import images from "../components/images";
import NotiCheck from "../asset/noticheck.svg";
import Navigation_Bar from "../components/Navigation_Bar";
import { format } from "date-fns";
import { Calendar } from "react-native-calendars";

function Coop({ }) {
	const navigation = useNavigation();
	const route = useRoute();
	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');
	const [markedDates, setMarkedDates] = useState({});
	const [token, setToken] = useState('');
	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);
	const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const [events, setEvents] = useState([]);
	const [selectedEvent, setSelectedEvent] = useState(null);
	const [teamId, setTeamId] = useState(route.params.teamId);
    const [teamTodos, setTeamTodos] = useState([]);

	useEffect(() => {
		fetchUserData();
    }, []);

    const fetchTeamTodos = async () => {
        try {
            const response = await axios.get(`http://192.168.30.220:4000/api/v1/getTeamTodo/${teamId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setTeamTodos(response.data);
            }
        } catch (error) {
            console.error("팀 일정을 불러오는데 실패했습니다:", error);
        }
    };

	const formatDate = date => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = `0${d.getMonth() + 1}`.slice(-2);
		const day = `0${d.getDate()}`.slice(-2);
		return `${year}.${month}.${day}`;
	};
	
	const fetchUserData = async () => {
		const userId = await getUserIdFromToken();
		const formattedDate = formatDate(selectedDate);
	
		try {
			const userResponse = await axios.get(`http://192.168.30.220:4000/api/v1/userInfo/${userId}`, {
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
					setBase64Image(userProfileImage || '');
					setUserNickname(nickname || '');
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
			if (event.todoDate) {
				const eventDateFormatted = event.todoDate.replace(/\./g, '-');
				newMarkedDates[eventDateFormatted] = { marked: true, dotColor: currentTheme.color1 };
			}
		});
		setMarkedDates(newMarkedDates);
	};

	const timeToIndex = time => {
		const [hours, minutes] = time.split(":").map(Number);
		return hours * 6 + Math.floor(minutes / 10);
	};

	/*
	useEffect(() => { setColorNum(color_num + 1); }, []);
	const handleAddNoti = () => {
		setColorNum((prevColorIndex) => (prevColorIndex + 1) % color_sheet.length);
	};

	const handleCheckToggle = (color_num) => {
		setClicked_check((prevClickedChecks) => {
			const newClickedChecks = [...prevClickedChecks];
			newClickedChecks[color_num] = !prevClickedChecks[color_num];
			return newClickedChecks;
		});
	}

	const Noties = (color_num) => (
		<Noti color={clicked_check[color_num] ? `${color_sheet[color_num]}80` : color_sheet[color_num]}>
			<Noti_Check onPress={() => {
				handleCheckToggle(color_num);
				handleAddNoti();
			}}>
				<images.noticheck width={15} height={15}
					color={clicked_check[color_num] ? `${color_sheet[color_num]}80` : "#B7BABF"} />
		  	</Noti_Check>
		  	<NotiText> </NotiText>
		</Noti>
	);

	const posts = [
		{
			id: 1,
			title: "제목입니다.",
			contents: "내용입니다.",
			date: "2024-02-10",
		},
		{
			id: 2,
			title: "제목입니다.",
			contents: "내용입니다.",
			date: "2024-02-12",
		}
	];
	const markedDates = posts.reduce((acc, current) => {
		const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
		acc[formattedDate] = {marked: true};
		return acc;
	}, {});
	
	const [selectedDate, setSelectedDate] = useState(
		format(new Date(), "yyyy-MM-dd"),
	);
	const markedSelectedDates = {
		...markedDates,
		[selectedDate]: {
			selected: true,
			marked: markedDates[selectedDate]?.marked,
		}
	};
	*/

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView>
				<MainView>
				<HorisontalView style={{marginTop: 20, marginBottom: 10}}>
						<Profile source={{ uri: `data:image/png;base64,${base64Image}` }} style={{ marginTop: 20 }} />
						<ProfileTextContainer>
							<MainText>{userNickname} 님,</MainText>
							<MainText style={{ color: currentTheme.color1 }}>
								{formatDate(new Date(), "yyyy.MM.dd")} 노티입니다!
							</MainText>
						</ProfileTextContainer>
					</HorisontalView>
				</MainView>
			</FullView>
			
			<FullView style={{flex: 1}}>
				<BarContainer>
					<MainText onPress={() => navigation.navigate('Todo')} style={{ marginRight: 20, color: "#B7BABF" }}>나의 일정</MainText>
					<MainText style={{ marginLeft: 20 }}>협업 일정</MainText>
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

						<MainText style={{ fontSize: 15, textAlign: 'center' }}> </MainText>
						
						
					</MainView>
				</ScrollView>
				<Navigation_Bar />
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
    align-self: flex-end;
    width: 50%;
    height: 2px;
    background-color: ${props => props.theme.color1};
    margin-top: 0px;
`;

const NotiContainer = styled.View`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 15px;
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

const Icons = styled.Image`
	width: 15px;
	height: 15px;
	margin: 20px;
`;

export default Coop;