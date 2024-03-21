/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */

import styled, { ThemeProvider } from 'styled-components/native';
import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, Text, TouchableOpacity, View, Image} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';

import { theme } from "../components/theme";
import images from "../components/images";
import { TextInput } from 'react-native-gesture-handler';
import Navigation_Bar from "../components/Navigation_Bar";


function Coop_Main({ onSelectTeam }) {
	const navigation = useNavigation();
	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');
	const [token, setToken] = useState('');
	const [clicked_add, setClicked_add] = useState(false);
	const [modal_TeamAddVisible, set_TeamAddModalVisible] = useState(false);
	const [modal_TeamOutVisible, set_TeamOutModalVisible] = useState(false);
	const [inputTeamLink, setInputTeamLink] = useState('');
	const [teams, setTeams] = useState([]);
	const [teamMembersCount, setTeamMembersCount] = useState({});
	const [pinClicked, setPinClicked] = useState({});
	const [outClicked, setOutClicked] = useState({});
	const [selectedTeamId, setSelectedTeamId] = useState(null);
	const [teamTodos, setTeamTodos] = useState([]);
	const [searchedTeam, setSearchedTeam] = useState(null);
	const [clickedSearch, setClickedSearch] = useState(false);

	useEffect(() => {
		fetchUserData();
		fetchTeams();
	}, [token]);

	useEffect(() => {
		teams.forEach(team => {
			fetchTeamMembers(team.teamId);
		});
	}, [teams]);

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

	const formatDate = date => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = `0${d.getMonth() + 1}`.slice(-2);
		const day = `0${d.getDate()}`.slice(-2);
		return `${year}.${month}.${day}`;
	};

	const fetchTeams = async () => {
		const storedToken = await AsyncStorage.getItem('token');
		if (!storedToken) return;
	
		try {
			const userId = getUserIdFromToken(storedToken);
			const response = await axios.get(`http://15.164.151.130:4000/api/v1/getTeam/${userId}`, {
				headers: { Authorization: `Bearer ${storedToken}` },
			});
			setTeams(response.data);

			if (response.status === 200) {
				setTeams(response.data);
				response.data.forEach(team => {
					fetchTeamTodos(team.teamId);
				});
			}
		} catch (error) {
			console.error("팀 목록을 불러오는데 실패했습니다:", error);
		}

		
	};	
	
	const fetchTeamMembers = async (teamId) => {
		try {
			const token = await AsyncStorage.getItem('token');
			const response = await axios.get(`http://15.164.151.130:4000/api/v1/getUserTeam/${teamId}`, {
				headers: { Authorization: `Bearer ${token}` },
			});
			setTeamMembersCount((prevState) => ({
				...prevState,
				[teamId]: response.data.length,
			}));
		} catch (error) {
			console.error("팀 참여 인원 수를 불러오는데 실패했습니다:", error);
		}
	};

	const rearrangeTeams = (pinnedTeamId) => {
		setPinClicked(current => {
			const pinnedTeams = teams.filter(team => current[team.teamId]);
			const unpinnedTeams = teams.filter(team => !current[team.teamId]);
	
			const newTeamsOrder = [...pinnedTeams, ...unpinnedTeams];
			setTeams(newTeamsOrder);
			return current;
		});
	};

	const handlePinClick = async (teamId) => {
		setPinClicked(prevState => ({
			...prevState,
			[teamId]: !prevState[teamId],
		}));
		rearrangeTeams(teamId);
	};
	

	const handleTeamClick = (teamId) => {
		navigation.navigate('Coop', { teamId: teamId });
	};

	const leaveTeam = async (teamId, userId) => {
		if (!teamId || !userId) return;
	
		try {
			const response = await axios.delete(`http://15.164.151.130:4000/api/v1/leaveTeam/${teamId}/${userId}`, {
				headers: { 'Authorization': `Bearer ${token}` },
			});
			if (response.status === 200) {
				fetchTeams();
				set_TeamOutModalVisible(false);
			}
		} catch (error) {
			console.error("팀을 나가는데 실패했습니다:", error);
		}
	};
	
	const Noti = ({ todo, index, currentTheme  }) => {
		const themeColor = currentTheme[todo.teamTodoColor];
		const opacity = index === 0 ? 1 : 0.5;
		const width = index === 1 ? 200 : 230;
		const marginTop = index === 1 ? -15 : 10;
		const zIndex = index === 1 ? 1 : 2;
		return (
			<Team_Noti style={{ backgroundColor: themeColor, opacity, width, marginTop, zIndex }}>
				<NotiCheck>
					{todo.teamTodoDone && <images.noticheck width={12} height={12}
						color={themeColor} />}
				</NotiCheck>
				<NotiText>{todo.teamTodoTitle}</NotiText>
			</Team_Noti>
		);
	};

	const fetchTeamTodos = async (teamId) => {
		try {
			const response = await axios.get(`http://15.164.151.130:4000/api/v1/getTeamTodo/${teamId}`);
			if (response.status === 200) {
				setTeamTodos(prevTodos => ({
					...prevTodos,
					[teamId]: response.data.slice(0, 2)
				}));
			}
		} catch (error) {
			console.error("팀 일정을 불러오는데 실패했습니다:", error);
		}
	};

	const fetchTeamInfo = async () => {
		try {
			const response = await axios.get(`http://15.164.151.130:4000/api/v1/getTeamInfo/${inputTeamLink}`);
			if (response.status === 200 && response.data) {
				setSearchedTeam(response.data);
			} else {
				setSearchedTeam(null);
			}
		} catch (error) {
			console.error("팀 정보를 가져오는데 실패했습니다:", error);
			setSearchedTeam(null);
		}
	};

	const handleEnterTeam = async () => {
		const userId = getUserIdFromToken(token);
		if (!userId || !inputTeamLink) return;
	
		try {
			const response = await axios.post(`http://15.164.151.130:4000/api/v1/enterTeam/${userId}/${inputTeamLink}`, {}, {
				headers: { 'Authorization': `Bearer ${token}` },
			});
			if (response.status === 200) {
				console.log("팀에 성공적으로 추가되었습니다.");
				fetchTeams();
				set_TeamAddModalVisible(false); 
				setClicked_add(false);
				setInputTeamLink('');
			}
		} catch (error) {
			console.error("팀에 사용자를 추가하는데 실패했습니다:", error);
		}
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
								{formatDate(new Date(), "yyyy.MM.dd")} 팀 노티입니다!
							</MainText>
						</ProfileTextContainer>
					</HorisontalView>
				</MainView>
			</FullView>
			
			<FullView style={{ flex: 1, marginBottom: 80 }}>
				<BarContainer>
					<MainText onPress={() => navigation.navigate('Todo')} style={{ marginRight: 20, color: "#B7BABF" }}>나의 일정</MainText>
					<MainText style={{ marginLeft: 20 }}>협업 일정</MainText>
				</BarContainer>
				<Bar />
				<Bar_Mini />
				
				
				<ScrollView>
					<MainView>
						<images.team_add
							width={20}
							height={20}
							color={clicked_add ? currentTheme.color1 : "#B7BABF"}
							onPress={() => {
								setClicked_add(!clicked_add);
								set_TeamAddModalVisible(true);
							}}
							style={{ margin: 10, alignSelf: 'flex-end' }}
						/>

						<Modal
							animationType="slide"
							transparent={true}
							visible={modal_TeamAddVisible}
							onRequestClose={() => set_TeamAddModalVisible(false)}>
							<ModalContainer>
								<ModalView>
									<MainText style={{ margin: 20, fontSize: 15 }}>팀 추가하기</MainText>

									<TouchableOpacity style={{
										width: 300, height: 40,
										backgroundColor: "#F2F3F5",
										borderRadius: 15,
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										marginBottom: 20,
									}}>
										<images.team_search width={15} height={15}
											style={{ margin: 10 }} onPress={() => {
												fetchTeamInfo();
												setClickedSearch(!clickedSearch);
											}} />
										<TextInput
											placeholder="팀 협업 링크 또는 태그 입력"
											value={inputTeamLink}
											onChangeText={(text) => setInputTeamLink(text)}
											style={{ fontSize: 10 }}
										/>
									</TouchableOpacity>

									{clickedSearch && (
										<TouchableOpacity style={{ borderWidth: 1,
											borderColor: currentTheme.color1,
											borderRadius: 15,
											width: 300,
											height: 40,
										}}>
											<HorisontalView style={{ justifyContent: 'space-between', alignItems: 'center', width: 270, height: 30 }}>
												<MainText style={{ marginTop: 10 }}>{searchedTeam}</MainText>
											<TouchableOpacity onPress={() => {
												handleEnterTeam();
												set_TeamAddModalVisible(!modal_TeamAddVisible);
												setClicked_add(false);
												setClickedSearch(!clickedSearch);
											}}
											style={{ marginTop: 10}}
											>
												<images.plus color={currentTheme.color1} width={20} height={20} />
											</TouchableOpacity>
										</HorisontalView>
										</TouchableOpacity>
									)}

									<TouchableOpacity onPress={() => {
										set_TeamAddModalVisible(!modal_TeamAddVisible);
										setClicked_add(false);
										setClickedSearch(false);
									}}
										style={{ marginTop: 20}}
									>
										<Text>닫기</Text>
									</TouchableOpacity>
								</ModalView>
							</ModalContainer>
						</Modal>

						<View>
							{teams.map((team) => (
								<TeamFrameContainer key={team.teamId}>
									<images.team_frame
										color={pinClicked[team.teamId] || outClicked[team.teamId] ? currentTheme.color1 : "#B7BABF"}
										style={{ position: 'absolute' }}
										onPress={() => handleTeamClick(team)}
									/>
									<images.team_pin
										width={15}
										height={15}
										color={pinClicked[team.teamId] ? currentTheme.color1 : "#B7BABF"}
										style={{ position: 'absolute', margin: 15, left: 10 }}
										onPress={() => handlePinClick(team.teamId)}
									/>

									<MainText style={{ position: 'absolute', top: 20, alignSelf: 'center' }}>
										{team.teamTitle}
									</MainText>

									<NotiContainer>
										{
											teamTodos[team.teamId] && teamTodos[team.teamId].length > 0 ? (
												teamTodos[team.teamId].map((todo, index) => (
													<View key={todo.teamTodoId} style={{ flexDirection: 'row', alignItems: 'center' }}>
														<Noti todo={todo} index={index} currentTheme={currentTheme} />
													</View>
												))
											) : (
												<NoTodoNoti>
													<NoTodoText>팀 일정이 없습니다.</NoTodoText>
												</NoTodoNoti>
											)
										}
									</NotiContainer>


									<Text style={{ position: 'absolute', top: 120, alignSelf: 'flex-start', marginLeft: 40, fontSize: 10 }}>
										참여자: {teamMembersCount[team.teamId] || 0}명
									</Text>

									<images.team_out
										width={15}
										height={15}
										color={outClicked[team.teamId] ? currentTheme.color1 : "#B7BABF"}
										onPress={() => {
											setSelectedTeamId(team.teamId);
											set_TeamOutModalVisible(true);
										}}
										style={{ position: 'absolute', margin: 15, right: 10 }}
									/>
								</TeamFrameContainer>
							))}
						</View>


						<Modal
							animationType="slide"
							transparent={true}
							visible={modal_TeamOutVisible}
							onRequestClose={() => set_TeamOutModalVisible(false)}>
							<ModalContainer>
								<ModalView>
									<MainText style={{ margin: 20, fontSize: 15 }}>팀을 정말 나가시겠습니까?</MainText>
									<HorisontalView style={{ alignItems: 'center', justifyContent: 'center' }}>
										<TeamOut
											onPress={() => {
												const userId = getUserIdFromToken(token);
												if (selectedTeamId && userId) {
													leaveTeam(selectedTeamId, userId);
												}
												set_TeamOutModalVisible(false);
												setOutClicked(false);
											}}
											style={{ backgroundColor: "#F2F3F5" }}
										>
											<Text>예</Text>
										</TeamOut>

										<TeamOut
											onPress={() => {
												set_TeamOutModalVisible(!modal_TeamOutVisible);
												setOutClicked(false);
											}}
											style={{ backgroundColor: currentTheme.color1 }}
										>
											<Text style={{ color: "white" }}>아니요</Text>
										</TeamOut>
									</HorisontalView>
								</ModalView>
							</ModalContainer>
						</Modal>
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

const NoTodoNoti = styled.View`
	width: 230px;
	height: 30px;
	border-radius: 15px;
	background-color: #D3D3D3;
	flex-direction: row;
	align-items: center;
	margin: 10px;
	justify-content: center;
`;

const NoTodoText = styled.Text`
	font-size: 10px;
	color: black; 
`;

const TeamFrameContainer = styled.View`
	position: relative;
	width: 300px;
	height: 150px;
	margin-bottom: 10px;
`;

const Team_Noti = styled.TouchableOpacity`
	width: 230px;
	height: 30px;
	border-radius: 15px;
	background-color: ${props => props.theme.color1};
	flex-direction: row;
	align-items: center;
	margin: 5px;
`;

const NotiCheck = styled.TouchableOpacity`
	width: 20px;
	height: 20px;
	border-radius: 100px;
	background-color: white;
	margin-left: 10px;
	justify-content: center;
	align-items: center;
`;

const NotiText = styled.Text`
	font-size: 10px;
	font-weight: normal;
	color: ${props => props.color || "white"};
	text-align: left;
	margin-left: 10px;
`;

const NotiContainer = styled.View`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 40px;
`;



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


const TeamOut = styled.TouchableOpacity`
	width: 120px;
	height: 40px;
	border-radius: 15px;
	justify-content: center;
	align-items: center;
	margin: 20px;
`;


export default Coop_Main;
