/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */

import styled, {ThemeProvider} from "styled-components/native"
import React, { useState, useEffect } from 'react';
import {
	ScrollView,
	Text,
	Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from "react-native-calendars";
import 'react-native-gesture-handler';
import { decode } from 'base-64';
import axios from 'axios';

import images from "../components/images";
import Navigation_Bar from "../components/Navigation_Bar";
import { theme } from '../components/theme';
import { format } from "date-fns";

function Diary() {
	const navigation = useNavigation();
	const route = useRoute();
	const { diaryId } = route.params;

	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');
	const [clicked_modify, setClicked_modify] = useState(false);
	const [clicked_delete, setClicked_delete] = useState(false);
	const [modal_DeleteVisible, set_DeleteModalVisible] = useState(false);
	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);
	const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const [diaryTitle, setDiaryTitle] = useState('');
    const [diaryContent, setDiaryContent] = useState('');
	
	const host = "192.168.30.197";

    useEffect(() => {
		const fetchUserData = async () => {
			const token = await AsyncStorage.getItem('token');

			if (token) {
				const userId = getUserIdFromToken(token);
				try {
					const response = await axios.get(`http://${host}:4000/api/v1/userInfo/${userId}`, {
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
        const fetchDiaryDetail = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
				try {
					const userId = getUserIdFromToken(token);
                    const response = await axios.get(`http://${host}:4000/api/v2/diaryDetail/${userId}/${diaryId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
					});
					if (response.data) {
                        setDiaryTitle(response.data.diaryTitle);
                        setDiaryContent(response.data.diaryContent);
                    }
                } catch (error) {
                    console.error("Error fetching diary detail:", error);
                }
            }
        };

        fetchDiaryDetail();
    }, []);

	const formatDate = date => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = `0${d.getMonth() + 1}`.slice(-2);
		const day = `0${d.getDate()}`.slice(-2);
		return `${year}.${month}.${day}`;
	};

	const markedDates = {
		[selectedDate]: {
			selected: true,
			selectedColor: currentTheme.color1,
		},
	};

	const onDayPress = day => {
		setSelectedDate(day.dateString);
	};

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView>
				<MainView>
					<HorisontalView style={{ marginTop: 20, marginBottom: 10 }}>
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
			
			<FullView style={{ flex: 1, marginBottom: 80 }}>
				<Bar />

				<ScrollView>
					<MainView>
						<HorisontalView style={{ justifyContent: 'space-between', padding: 20 }}>
							<images.calendar width={20} height={20}
								color={clicked_calendar ? currentTheme.color1 : "#B7BABF"}
								onPress={() => setClicked_calendar(!clicked_calendar)} />
							<images.share width={20} height={20}
								color={clicked_share ? currentTheme.color1 : "#B7BABF"}
								onPress={() => setClicked_share(!clicked_share)} />
						</HorisontalView>

						<HorisontalView style={{ justifyContent: 'flex-end', padding: 15 }}>
							<images.diary_modify width={20} height={20}
								color={clicked_modify ? currentTheme.color1 : "#B7BABF"}
								style={{ marginRight: 10 }}
								onPress={() => setClicked_modify(!clicked_modify)} />
							<images.diary_delete width={20} height={20}
								color={clicked_delete ? currentTheme.color1 : "#B7BABF"}
								onPress={() => {
									setClicked_delete(!clicked_delete);
									set_DeleteModalVisible(true);
								}} />
						</HorisontalView>

						{clicked_calendar && (
							<>
								<Calendar
									onDayPress={onDayPress}
									markedDates={markedDates}
								/>
							</>
						)}

						<Text style={{ fontSize: 24, fontWeight: 'bold', marginVertical: 10 }}>{diaryTitle}</Text>
						<Text style={{ fontSize: 16, marginVertical: 5 }}>{diaryContent}</Text>

						<Modal
							animationType="slide"
							transparent={true}
							visible={modal_DeleteVisible}
							onRequestClose={() => set_DeleteModalVisible(false)}>
							<ModalContainer>
								<ModalView>
									<MainText style={{ margin: 20, fontSize: 15 }}>일기를 정말 삭제하시겠습니까? </MainText>
									<HorisontalView style={{ alignItems: 'center', justifyContent: 'center' }}>
										<Delete
											onPress={() => {
												set_DeleteModalVisible(!modal_DeleteVisible);
												setClicked_delete(false);
											}}
											style={{ backgroundColor: "#F2F3F5" }}
										>
											<Text>예</Text>
										</Delete>

										<Delete
											onPress={() => {
												set_DeleteModalVisible(!modal_DeleteVisible);
												setClicked_delete(false);
											}}
											style={{ backgroundColor: currentTheme.color1 }}
										>
											
											<Text style={{ color: "white" }}>아니요</Text>
										</Delete>
									</HorisontalView>
								</ModalView>
							</ModalContainer>
						</Modal>
					</MainView>
				</ScrollView>
			</FullView>
			<Navigation_Bar selectedTheme={currentTheme} />
		</ThemeProvider>
	);
}

export default Diary;

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
    background-color: #B7BABF;
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

const Delete = styled.TouchableOpacity`
	width: 120px;
	height: 40px;
	border-radius: 15px;
	justify-content: center;
	align-items: center;
	margin: 20px;
`;
