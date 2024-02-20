/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */

import styled, { ThemeProvider } from 'styled-components/native';
import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, Text, TouchableOpacity, } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';

import { theme } from "../components/theme";
import images from "../components/images";
import { TextInput } from 'react-native-gesture-handler';
import Navigation_Bar from "../components/Navigation_Bar";


function Coop_Main() {
	const navigation = useNavigation();
	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');

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
		const fetchUserData = async () => {
			const token = await AsyncStorage.getItem('token');

			if (token) {
				const userId = getUserIdFromToken(token);
				try {
					const response = await axios.get(`http://192.168.30.122:4000/api/v1/userInfo/${userId}`, {
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
		fetchUserData();
	}, []);

	const [clicked_add, setClicked_add] = useState(false);
	const [clicked_out, setClicked_out] = useState(false);
	const [clicked_check, setClicked_check] = useState(Array(5).fill(false));
	const [modal_TeamAddVisible, set_TeamAddModalVisible] = useState(false);
	const [modal_TeamOutVisible, set_TeamOutModalVisible] = useState(false);
	const [inputTeamLink, setInputTeamLink] = useState('');
	const [clicked_pin, setClicked_pin] = useState(false);

	const formatDate = date => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = `0${d.getMonth() + 1}`.slice(-2);
		const day = `0${d.getDate()}`.slice(-2);
		return `${year}.${month}.${day}`;
	};

	/*
    const TeamFrame = ({ teamName, clickedPin, setClickedPin, clickedOut, setClickedOut, colorSheet }) => (
		<TeamFrameContainer>
			<images.team_frame
				color={clickedPin ? currentTheme.color1 : "#B7BABF"}
				style={{ position: 'absolute' }}
				onPress={handleTeamFramePress} />
			<images.team_pin
				width={15}
				height={15}
				color={clickedPin ? currentTheme.color1 : "#B7BABF"}
				onPress={() => setClickedPin(!clickedPin)}
				style={{ position: 'absolute', margin: 15, left: 10 }}
			/>
			
			<MainText style={{ position: 'absolute', margin: 15, alignSelf: 'center' }}>{teamName}</MainText>
			
			{events.map((event, index) => (
				<Noti key={event.todoId}
					style={{ backgroundColor: event.selectedColor, }}
						onPress={() => {
							setModalVisible(true);
							handleEditEvent(event);
						}}>
						<Noti_Check onPress={() => toggleComplete(event.todoId, index)}>
							{event.todoDone && <images.noticheck width={10} height={10}
								color={event.selectedColor} /> }
						</Noti_Check>
						<NotiTextContainer>
							<NotiText>{event.todoTitle}</NotiText>
							<NotiText>{`${event.todoStartTime} ~ ${event.todoEndTime}`}</NotiText>
					</NotiTextContainer>
				</Noti>
			))}
			
			<images.team_out
				width={15}
				height={15}
				color={clickedOut ? currentTheme.color1 : "#B7BABF"}
				onPress={() => {
					setClickedOut(!clickedOut);
					set_TeamOutModalVisible(true);
				}}
				style={{ position: 'absolute', margin: 15, right: 10 }}
			/>
		</TeamFrameContainer>
	);

	const handleTeamFramePress = () => {
        navigation.navigate('Coop', { selectedTheme: currentTheme });
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
										justiftContent: 'center',
										alignItems: 'center',
										marginBottom: 20,
									}}>
										<images.team_search width={15} height={15}
											style={{ margin: 10 }} />
										<TextInput
											placeholder="팀 협업 링크 또는 태그 입력"
											value={inputTeamLink}
											onChangeText={(text) => setInputTeamLink(text)}
											style={{fontSize: 10}}
										/>
									</TouchableOpacity>

									<TouchableOpacity onPress={() => {
										set_TeamAddModalVisible(!modal_TeamAddVisible);
										setClicked_add(false);
									}}>
									<Text>닫기</Text>
								</TouchableOpacity>
								</ModalView>
							</ModalContainer>
						</Modal>

						<Modal
							animationType="slide"
							transparent={true}
							visible={modal_TeamOutVisible}
							onRequestClose={() => set_TeamOutModalVisible(false)}>
							<ModalContainer>
								<ModalView>
									<MainText style={{ margin: 20, fontSize: 15 }}>팀을 정말 나가시겠습니까?</MainText>
									<HorisontalView style={{alignItems: 'center', justifyContent: 'center'}}>
									<TeamOut
										onPress={() => {
											set_TeamOutModalVisible(!modal_TeamOutVisible);
											setClicked_out(false);
											}}
										style={{backgroundColor: "#F2F3F5"}}
										>
										<Text>예</Text>
									</TeamOut>

									<TeamOut
										onPress={() => {
											set_TeamOutModalVisible(!modal_TeamOutVisible);
											setClicked_out(false);
											}}
										style={{backgroundColor: currentTheme.color1.color1}}
										>
											
										<Text style={{color: "white"}}>아니요</Text>
									</TeamOut>
									</HorisontalView>
								</ModalView>
							</ModalContainer>
						</Modal>
					
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
    align-self: flex-end;
    width: 50%;
    height: 2px;
    background-color: ${props => props.theme.color1};
    margin-top: 0px;
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
	background-color: ${props => props.color || "#FF7154"};
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
	border-top-right-radius: 20px
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
