/* eslint-disable no-shadow */
/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */

import styled, {ThemeProvider} from "styled-components/native"
import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useRoute, useNavigation, useIsFocused } from "@react-navigation/native";
import 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';
import { theme } from "../components/theme";
import images from "../components/images";
import Navigation_Bar from "../components/Navigation_Bar";
import { format } from "date-fns";
import { Calendar } from "react-native-calendars";
import ScheduleTimeTable from "../components/ScheduleTimeTable";
import Clipboard from '@react-native-community/clipboard';

function Coop({ }) {
	const navigation = useNavigation();
	const route = useRoute();
	const { teamId } = route.params;
	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');
	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);
	const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const [events, setEvents] = useState([]);
	const [teamMembers, setTeamMembers] = useState([]);
	const [schedule, setSchedule] = useState(Array(24 * 6).fill(false));
	const [todos, setTodos] = useState([]);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [clicked_memo, setClicked_memo] = useState(false);
	const [memoContent, setMemoContent] = useState('');
	const [isMemoModalVisible, setIsMemoModalVisible] = useState(false);
	const [isShareModalVisible, setIsShareModalVisible] = useState(false);

	useEffect(() => {
		fetchUserData();
		fetchTeamInfo();
		fetchTeamMembers();
		fetchTodosForTeam();
	}, [selectedDate, currentTheme]);

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
				setBase64Image(userProfileImage || ""); 
				setUserNickname(nickname || ""); 
			} catch (error) {
				console.error("Error fetching user data:", error);
			}
		}
	};

	const fetchTeamInfo = async () => {
		const token = await AsyncStorage.getItem('token');
		if (token) {
			try {
				const todoresponse = await axios.get(`http://15.164.151.130:4000/api/v1/getTeamTodo/${teamId.teamId}`, {
					headers: {
						'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
					},
				});
				if (todoresponse.data && Array.isArray(todoresponse.data)) {
					const updatedEvents = todoresponse.data.map(event => ({
						...event,
						teamSelectedColor: currentTheme[event.teamTodoColor] || event.teamTodoColor,
					}));
					setEvents(updatedEvents);
					
				}
			} catch (error) {
				console.error("Failed to fetch team info:", error);
			}
		}
	};
	
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
	
	const markedDates = {
		[selectedDate]: {
			selected: true,
			selectedColor: currentTheme.color1,
		}
	};

	const onDayPress = day => {
		setSelectedDate(day.dateString);
	};
	
	const formatDate = date => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = `0${d.getMonth() + 1}`.slice(-2);
		const day = `0${d.getDate()}`.slice(-2);
		return `${year}.${month}.${day}`;
	};
	
	const toggleComplete = async (teamTodoId, index) => {
		try {
			const newCompletedStatus = !events[index].teamTodoDone;
			const token = await AsyncStorage.getItem('token');
            const response = await axios.put(
                `http://15.164.151.130:4000/api/v1/updateTeamTodo/${teamId.teamId}/${teamTodoId}`,
                {
                    ...events[index],
                    teamTodoDone: newCompletedStatus, 
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (response.status === 200) {
                const updatedEvents = events.map((event, evtIndex) =>
                    evtIndex === index
                        ? { ...event, teamTodoDone: newCompletedStatus }
                        : event,
                );
                setEvents(updatedEvents);
            } else {
                console.error("Failed to update todo status:", response);
            }
        } catch (error) {
            console.error("Error updating todo status:", error);
        }
	};

	const fetchTeamMembers = async () => {
		const token = await AsyncStorage.getItem('token');
		try {
			const response = await axios.get(`http://15.164.151.130:4000/api/v1/getUserTeam/${teamId.teamId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			const memberInfos = await Promise.all(response.data.map(async (member) => {
				const profileResponse = await axios.get(`http://15.164.151.130:4000/api/v1/userInfo/${member.userId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				return {
					profile: profileResponse.data.userProfile,
					name: profileResponse.data.userNickname,
				};
			}));
	
			setTeamMembers(memberInfos);
		} catch (error) {
			console.error("Failed to fetch team members:", error);
		}
	};

	const timeToIndex = (time) => {
		if (!time || !time.includes(":")) {
			return -1;
		}
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 6 + Math.floor(minutes / 10);
	};

	const calculateDDay = date => {
		const formattedDate = date.replace(/\./g, '-');

		const today = new Date(selectedDate);
		today.setHours(0, 0, 0, 0);

		const targetDate = new Date(formattedDate);
		targetDate.setHours(0, 0, 0, 0);

		const difference = targetDate - today;
		const dDay = Math.ceil(difference / (1000 * 60 * 60 * 24));
	
		if (dDay < 0) {
			return '';
		} else if (dDay === 0) {
			return 'D - Day';
		} else {
			return `D - ${dDay}`;
		}
	};

	const fetchTodosForTeam = async () => {
		const token = await AsyncStorage.getItem('token');
		if (!token) return;
	
		try {
			const scheduleResponse = await axios.get(`http://15.164.151.130:4000/api/v1/getSchedule/${teamId.teamId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
	
			let todosDetails = await Promise.all(scheduleResponse.data.map(async ({ todoId }) => {
				const todoResponse = await axios.get(`http://15.164.151.130:4000/api/v1/getTodoByTodoId/${todoId}`, {
					headers: { Authorization: `Bearer ${token}` },
				});
				return todoResponse.data;
			}));

			todosDetails = todosDetails.flat();
			const filteredTodos = todosDetails.filter(todo => todo.todoDate === format(new Date(selectedDate), "yyyy.MM.dd"));
			setTodos(filteredTodos);

			const newSchedule = Array(24 * 6).fill(0);
			filteredTodos.forEach(({ todoStartTime, todoEndTime }) => {
				const startIndex = timeToIndex(todoStartTime);
				const endIndex = timeToIndex(todoEndTime);
	
				if (startIndex >= 0 && endIndex > startIndex) {
					for (let i = startIndex; i < endIndex; i++) {
						newSchedule[i] += 0.4;
					}
				}
			});
			const adjustedSchedule = newSchedule.map(opacity => Math.min(opacity, 1));
	
			setSchedule(adjustedSchedule);
		} catch (error) {
			console.error("할 일 정보를 가져오는 중 오류가 발생했습니다.", error);
		}
	};

	const ScheduleInfoList = ({ todos }) => {
		return (
			<ScheduleInfoContainer>
				{todos.map((todo, index) => (
					<ScheduleInfoText key={index}>
						{todo.todoTitle}, {todo.todoStartTime} ~ {todo.todoEndTime}
					</ScheduleInfoText>
				))}
			</ScheduleInfoContainer>
		);
	};

	const fetchTeamMemo = async () => {
		const token = await AsyncStorage.getItem('token');
		try {
			const response = await axios.get(`http://15.164.151.130:4000/api/v1/getTeamMemo/${teamId.teamId}`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});
			if (response.data && response.data.length > 0) {
				setMemoContent(response.data[0].memoContent);
			} else {
				setMemoContent("메모가 없습니다.");
			}
		} catch (error) {
			console.error("Error fetching team memo:", error);
			setMemoContent("메모 정보를 불러올 수 없습니다.");
		}
	};

	const addOpacityToColor = (color, opacity) => {
		const hexOpacity = Math.floor(opacity * 255).toString(16).padStart(2, '0');
		return `${color}${hexOpacity}`;
	};

	const MemoModal = ({ isVisible, onClose, memoContent }) => {
		return (
			<Modal
				animationType="slide"
				transparent={true}
				visible={isVisible}
				onRequestClose={onClose}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<View style={styles.modalHeader}>
							<Text style={[styles.modalTitle, { color: '#505050' }]}>메모</Text>
							<TouchableOpacity onPress={onClose} style={styles.closeButton}>
								<images.close width={10} height={10} />
							</TouchableOpacity>
						</View>
						<Text style={{ fontSize: 10, padding: 20 }}>{memoContent}</Text>
					</View>
				</View>
			</Modal>
		);
	};

	const shareShowModal = () => {
		setIsShareModalVisible(true);
	};

	const copyTeamId = () => {
		Clipboard.setString(teamId.teamId);
	};

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView>
				<MainView>
					<HorisontalView style={{ marginTop: 20, marginBottom: 10 }}>
						<Profile source={base64Image ? { uri: base64Image } : images.profile}
							style={{ marginTop: 20 }} />
						<ProfileTextContainer>
							<MainText>{userNickname} 님,</MainText>
							<MainText style={{ color: currentTheme.color1 }}>
								{formatDate(new Date(selectedDate), "yyyy.MM.dd")} 팀 노티입니다!
							</MainText>
						</ProfileTextContainer>
					</HorisontalView>
				</MainView>
			</FullView>
			
			<FullView style={{ flex: 1, marginBottom: 80 }}>
				<BarContainer>
					<MainText onPress={() => navigation.navigate('Todo')} style={{ marginRight: 20, color: "#B7BABF" }}>나의 일정</MainText>
					<MainText onPress={() => navigation.navigate('Coop_Main')} style={{ marginLeft: 20 }}>협업 일정</MainText>
				</BarContainer>
				<Bar />
				<Bar_Mini />

				<ScrollView >
					<MainView>
						<HorisontalView style={{ justifyContent: 'space-between', padding: 20 }}>
							<images.calendar width={20} height={20}
								color={clicked_calendar ? currentTheme.color1 : "#B7BABF"}
								onPress={() => setClicked_calendar(!clicked_calendar)} />
							<images.share width={20} height={20}
								color={clicked_share ? currentTheme.color1 : "#B7BABF"}
								onPress={() => {
									setClicked_share(!clicked_share);
									shareShowModal();
								}}
							/>
						</HorisontalView>

						{isShareModalVisible && (
							<Modal
								animationType="slide"
								transparent={true}
								visible={isShareModalVisible}
								onRequestClose={() => setIsShareModalVisible(false)}
							>
								<ModalContainer>
									<ModalView style={{ justifyContent: 'center', alignItems: 'center' }}>
										<MainText style={{ marginBottom: 30, fontSize: 15 }}>팀ID 공유하기</MainText>
										<HorisontalView style={{ justifyContent: 'center', alignItems: 'center' }}>
											<TouchableOpacity style={{
												width: 300, height: 60,
												backgroundColor: "#F2F3F5",
												borderRadius: 15,
												flexDirection: 'row',
												justifyContent: 'center',
												alignItems: 'center',
												marginBottom: 20,
											}}>
												<MainText style={{ fontSize: 13 }}>Team ID: {teamId.teamId}</MainText>
												<images.copy color={currentTheme.color1} width={20} height={20}
													onPress={() => {
														copyTeamId();
														setIsShareModalVisible(false);
														setClicked_share(!clicked_share);
													}}
													style={{ marginLeft: 10 }}
												/>
											</TouchableOpacity>
										</HorisontalView>
										<TouchableOpacity onPress={() => {
											setIsShareModalVisible(false);
											setClicked_share(!clicked_share);
										}}>
											<Text style={{ marginTop: 20 }}>닫기</Text>
										</TouchableOpacity>
									</ModalView>
								</ModalContainer>
							</Modal>
						)}

						{clicked_calendar && (
							<>
								<Calendar
									onDayPress={onDayPress}
									markedDates={markedDates}
								/>
							</>
						)}
						
						<MainText style={{ fontSize: 15, textAlign: 'center', paddingBottom: 10 }}>{teamId.teamTitle}</MainText>

						<View style={{ flexDirection: 'row', alignSelf: 'center', alignItems: 'center' }}>
							{teamMembers.map((member, index) => (
								<View key={index} style={{ alignItems: 'center', marginRight: 10 }}>
									<Image
										source={member.profile ? { uri: member.profile } : images.profile}
										style={{ width: 30, height: 30, borderRadius: 15, marginBottom: 5 }}
									/>
									<Text style={{ fontSize: 12, color: '#B7BABF', marginBottom: 10 }}>{member.name}</Text>
								</View>
							))}
						</View>
						
						{events.map((event, index) => (
							<Noti
								key={event.teamTodoId}
								style={{
									backgroundColor: event.teamTodoDone ? addOpacityToColor(event.teamSelectedColor, 0.6) : event.teamSelectedColor,
								}}
							>
								<Noti_Check onPress={() => toggleComplete(event.teamTodoId, index)}>
									{event.teamTodoDone && <images.noticheck width={15} height={15}
										color={event.teamSelectedColor} />}
								</Noti_Check>
								<NotiTextContainer>
									<NotiText>{event.teamTodoTitle}</NotiText>
									<NotiText>{calculateDDay(event.teamTodoDate)}</NotiText>
								</NotiTextContainer>
							</Noti>
						))}

						<ScheduleTimeTable schedule={schedule} currentTheme={currentTheme} />

						<HorisontalView style={{ justifyContent: 'space-between' }}>
							<TouchableOpacity onPress={() => setIsModalVisible(true)} style={{ margin: 10 }}>
								<Text style={{ color: currentTheme.color1 }}>일정 보기</Text>
							</TouchableOpacity>

							<Modal
								animationType="slide"
								transparent={true}
								visible={isModalVisible}
								onRequestClose={() => {
									setIsModalVisible(!isModalVisible);
								}}
							>
								<ModalContainer>
									<ModalView style={{ justifyContent: 'center', alignItems: 'center' }}>
										<ScrollView>
											<ScheduleInfoList todos={todos} />
										</ScrollView>
										<TouchableOpacity
											onPress={() => setIsModalVisible(!isModalVisible)}
											style={{ marginTop: 20, alignSelf: 'center' }}
										>
											<Text style={{ marginBottom: 40 }}>닫기</Text>
										</TouchableOpacity>
									</ModalView>
								</ModalContainer>
							</Modal>

							<TouchableOpacity
								style={{
									backgroundColor: clicked_memo ? currentTheme.color1 : "#333333",
									width: 45,
									height: 45,
									borderRadius: 100,
									alignItems: 'center',
									justifyContent: 'center',
									borderColor: "#ffffff",
									borderWidth: 2,
									marginTop: -35,
								}}
								onPress={() => {
									setClicked_memo(!clicked_memo);
									fetchTeamMemo();
									setIsMemoModalVisible(true);
								}}
							>
								<images.team_memo width={20} height={20} color={clicked_memo ? "white" : "#B7BABF"} />
							</TouchableOpacity>

							<MemoModal
								isVisible={isMemoModalVisible}
								onClose={() => { setIsMemoModalVisible(false); setClicked_memo(!clicked_memo); }}
								memoContent={memoContent}
							/>
						</HorisontalView>
						
					</MainView>
				</ScrollView>
			</FullView>
			<Navigation_Bar />
		</ThemeProvider>
	);
}


const ModalContainer = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: flex-end;
    align-items: center;
`;

const ModalView = styled.View`
    background-color: white;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px;
	width: 100%;
	height: 250px;
    align-items: center;
`;

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

const ScheduleInfoContainer = styled.View`
  margin-top: 20px;
`;

const ScheduleInfoText = styled.Text`
  color: black;
  font-size: 12px;
  font-weight: normal;
  align-self: center;
  margin-top: 10px;
`;

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		width: '90%',
		backgroundColor: '#EEEFF0',
		borderRadius: 20,
		padding: 20,
		alignItems: 'center',
	},
	modalHeader: {
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	modalTitle: {
		fontSize: 13,
		fontWeight: 'bold',
	},
	closeButton: {
	},
});

export default Coop;