/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */

import styled, { ThemeProvider } from "styled-components/native";
import React, { useState, useEffect } from 'react';
import {
	View,
	ScrollView,
	TouchableOpacity,
	Alert,
	Text,
	Image,
} from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from "react-native-calendars";
import 'react-native-gesture-handler';
import { decode } from 'base-64';
import axios from 'axios';

import images from "../components/images";
import Navigation_Bar from "../components/Navigation_Bar";
import { theme } from '../components/theme';
import { format } from "date-fns";


function Diary_Main({ }) {
	const navigation = useNavigation();
    const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');
	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);
	const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
	const [diaries, setDiaries] = useState([]);

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
					setBase64Image(userProfileImage || ""); 
					setUserNickname(nickname || ""); 
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

	const fetchDiaries = async () => {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const userId = getUserIdFromToken(token);
            try {
                const response = await axios.get(`http://15.164.151.130:4000/api/v2/diarylist/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.status === 200 && response.data) {
                    setDiaries(response.data);
                }
            } catch (error) {
                console.error("Error fetching diaries:", error);
            }
        }
    };

	useFocusEffect(
        React.useCallback(() => {
            fetchDiaries();
        }, [])
	);
	
	const renderContent = (content) => {
		return (
			<>
				<DiaryText
					style={{ margin: 10 }}
					numberOfLines={4}
				>
					{content}
				</DiaryText>
				<DiaryText style={{ marginLeft: 20 }} color={"#B7BABF"}>더보기...</DiaryText>
			</>
		);
	};
	

	const DiaryFrame = ({ diary }) => {
		const diaryDate = new Date(diary.diaryDate);
		const isValidDate = !isNaN(diaryDate);
		const [lineCount, setLineCount] = useState(0);
	
		const pictureHeight = lineCount <= 4 ? 80 : 40;
		const pictureTop = pictureHeight === 80 ? 200 : 250;
	
		const getEmotionIcon = () => {
			const emotionLevel = diary.diaryEmotion;
			switch (emotionLevel) {
				case 1: return images.emotion1;
				case 2: return images.emotion2;
				case 3: return images.emotion3;
				case 4: return images.emotion4;
				case 5: return images.emotion5;
				default: return null;
			}
		};
	
		const emotionIcon = getEmotionIcon();
	
		return (
			<DiaryContainer>
				<Diary_Frame onPress={() => {
					navigation.navigate("Diary", { diaryId: diary.diaryId });
				}}>
					{isValidDate && (
						<MainText style={{ top: 10, color: currentTheme.color1, alignSelf: 'center' }}>
							{format(diaryDate, "yyyy.MM.dd")}
						</MainText>
					)}
					<Diary_TItle color={currentTheme.color1} style={{ marginTop: 5, fontSize: 12 }}>{diary.diaryDate}</Diary_TItle>
					<Diary_TItle style={{ margin: 10 }}>{diary.diaryTitle}</Diary_TItle>
					<TouchableOpacity style={{ width: 250, height: 1, backgroundColor: '#E3E4E6', alignSelf: 'center' }} />
					{renderContent(diary.diaryContent)}
					{
						diary.diaryImg ? (
							<Diary_Picture
								source={{ uri: diary.diaryImg }}
								style={{ width: 250, height: pictureHeight, borderRadius: 15, top: pictureTop, position: 'absolute', alignSelf: 'center' }}
							/>
						) : (
							<View style={{ width: 250, height: pictureHeight, backgroundColor: '#E3E4E6', borderRadius: 15, top: pictureTop, position: 'absolute', alignSelf: 'center' }} />
						)
					}
					{emotionIcon && (
						<DiaryEmotion style={{elevation: 5,}}>
							<Image source={emotionIcon} style={{ width: 50, height: 60 }} />
						</DiaryEmotion>
					)}
				</Diary_Frame>
			</DiaryContainer>
		);
	};
	

	const formatDate = date => {
		const d = new Date(date);
		const year = d.getFullYear();
		const month = `0${d.getMonth() + 1}`.slice(-2);
		const day = `0${d.getDate()}`.slice(-2);
		return `${year}.${month}.${day}`;
	};

	const getEmotionIconForDate = (emotionLevel) => {
		switch (emotionLevel) {
			case 1: return images.emotion1;
			case 2: return images.emotion2;
			case 3: return images.emotion3;
			case 4: return images.emotion4;
			case 5: return images.emotion5;
			default: return null;
		}
	};

	const markedDates = diaries.reduce((acc, diary) => {
		const formattedDate = diary.diaryDate.replace(/\./g, '-');
		acc[formattedDate] = {
			marked: true,
			dotColor: currentTheme.color1,
			emotionIcon: getEmotionIconForDate(diary.diaryEmotion),
		};
		return acc;
	}, {
		[selectedDate]: {
			selected: true,
			selectedColor: currentTheme.color1,
		},
	});
	
	const renderDay = (day) => {
		const { dateString } = day;
		const marked = markedDates[dateString];
	
		return (
			<View style={{ alignItems: 'center', backgroundColor: marked ? currentTheme.color1 : 'transparent', padding: 5, borderRadius: 100 }}>
				<Text style={{ color: marked ? 'white' : 'black' }}>{day.day}</Text>
				{marked && marked.emotionIcon ? (
					<Image source={marked.emotionIcon} style={{ width: 30, height: 40 }} />
				) : (
					<View style={{ width: 30, height: 40 }} />
				)}
			</View>
		);
	};
	

	const onDayPress = day => {
		setSelectedDate(day.dateString);
		const selectedDiary = diaries.find(diary => {
			const formattedDiaryDate = diary.diaryDate.replace(/\./g, '-');
			return formattedDiaryDate === day.dateString;
		});
	
		if (selectedDiary) {
			navigation.navigate("Diary", { diaryId: selectedDiary.diaryId });
		} else {
			Alert.alert("선택한 날짜에 해당하는 일기가 없습니다.");
		}
	};

	const createDiary = async () => {
		const token = await AsyncStorage.getItem('token');
		if (!token) {
			Alert.alert("오류", "로그인 정보를 찾을 수 없습니다.");
			return;
		}
        
		try {
			const userId = getUserIdFromToken(token);
			const response = await axios.get(`http://15.164.151.130:4000/api/v3/createDiary/${userId}`, {
				headers: { 'Authorization': `Bearer ${token}` },
				params: { diaryDate: selectedDate },
			});

			if (response.data) {
				Alert.alert("성공", "일기가 성공적으로 생성되었습니다.", [{ text: "OK", onPress: () => fetchDiaries() }]);
			}
		} catch (error) {
			console.error("Error creating diary:", error);
			Alert.alert("생성 실패", "일기 생성 중 문제가 발생했습니다.");
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
								{formatDate(new Date(selectedDate), "yyyy.MM.dd")} 일기입니다!
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

						{clicked_calendar && (
							<>
								<Calendar
									onDayPress={onDayPress}
									markedDates={markedDates}
									markingType={'custom'}
									dayComponent={({ date, state }) => {
										return renderDay(date);
									}}
								/>
							</>
						)}

						{diaries.sort((a, b) => new Date(b.diaryDate) - new Date(a.diaryDate)).map(diary => (
							<DiaryFrame
								key={diary.diaryId}
								diary={diary}
							/>
						))}

						<TouchableOpacity onPress={createDiary} style={{ margin: 10, alignItems: 'center' }}>
							<Text style={{ color: currentTheme.color1, fontSize: 15 }}>일기 생성</Text>
						</TouchableOpacity>
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

const DiaryText = styled(MainText)`
	font-size: 10px;
	font-weight: normal;
`;

const Bar = styled.View`
    width: 100%;
    height: 1px;
    background-color: #B7BABF;
`;

const DiaryContainer = styled.View`
	position: relative;
	width: 300px;
	height: 320px;
`;

const Diary_Frame = styled.TouchableOpacity`
	width: 300px;
	height: 300px;
	border-width: 1px;
	border-color: #B7BABF;
	padding: 10px;
	border-radius: 15px;
`;

const Diary_TItle = styled.Text`
	font-size: ${props => props.fontSize || "15px"};
	text-align: center;
	font-weight: bold;
	color: ${props => props.color || "black"};
`;

const Diary_Picture = styled.Image`
	width: ${(props) => props.size || '200px'};
	height: ${(props) => props.size || '100px'};
`;

const DiaryEmotion = styled.View`
	width: 80px;
	height: 80px;
	border-radius: 100px;
	background-color: ${(props) => props.theme.color1 || "white"};
	justify-content: center;
	align-items: center;
	position: absolute;
	position: absolute;
	right: 10px;
	top: 180px;
	border-color: white;
	border-width: 1px;
	border-style: solid;
`;


export default Diary_Main;
