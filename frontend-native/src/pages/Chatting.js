/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
import styled, { ThemeProvider } from 'styled-components/native';

import React, {useState, useEffect, useRef } from 'react';
import {View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import ChatMessage from '../components/ChatMessage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';
import { format, parseISO  } from "date-fns";

import images from "../components/images";
import theme from "../components/theme";
import Navigation_Bar from "../components/Navigation_Bar";

const ChatDiv = styled.View`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

function Chatting() {
	const [messages, setMessages] = useState([]);
	const [inputValue, setInputValue] = useState('');
	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
	const [base64Image, setBase64Image] = useState('');
	const [userNickname, setUserNickname] = useState('');
	const scrollViewRef = useRef();

	useEffect(() => {
        fetchChatHistory();
		fetchUserData();
	}, []);

	const handleSubmit = async (message) => {
		if (!message.trim()) return; // 메시지가 비어있는 경우 무시
		addMessage(message, true);
		const storedToken = await AsyncStorage.getItem('token');
		if (!storedToken) return;
	
		try {
			const userId = getUserIdFromToken(storedToken);
			const response = await axios.post(`http://15.164.151.130:4000/api/v3/ask/${userId}`, {
				chat_content: message,
			});
			if (response.data) {
				addMessage(response.data.chatContent, !response.data.chatWho);
				setInputValue(''); // 입력 필드 초기화
				await fetchChatHistory(); // 채팅 목록을 다시 불러와 화면을 업데이트
			}
		} catch (error) {
			console.error('Error fetching Gpt response: ', error);
		}
	};

	const addMessage = (message, isUser) => {
		const currentDate = format(new Date(), "MM/dd");
		setMessages(prevMessages => [...prevMessages, { text: message, isUser, date: currentDate }]);
	};
	
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
	
	const fetchChatHistory = async () => {
		const token = await AsyncStorage.getItem('token');
		if (!token) return;

		const userId = getUserIdFromToken(token);
		if (!userId) return;

		try {
			const response = await axios.get(`http://15.164.151.130:4000/api/v3/chatlist/${userId}`, {
				headers: {
					'Authorization': `Bearer ${token}`,
				},
			});
			const chatHistory = response.data.map(chat => ({
				text: chat.chatContent,
				isUser: !chat.chatWho,
				date: format(parseISO(chat.chatDate), "MM/dd"),
			}));
			setMessages(chatHistory);
		} catch (error) {
			console.error('Error fetching chat history:', error);
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
								노티와 대화해보세요!
							</MainText>
						</ProfileTextContainer>
					</HorisontalView>
				</MainView>
			</FullView>
			
			<FullView style={{ flex: 1, marginBottom: 80 }}>
				<Bar />
				<ScrollView
					ref={scrollViewRef}
					onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
				>
					<MainView>
						<ChatDiv>
							{messages.map((message, index) => (
								<ChatMessage
									key={index}
									message={message.text}
									isUser={message.isUser}
									userColor={currentTheme.color1}
									date={message.date}
								/>
							))}
						</ChatDiv>
					</MainView>
				</ScrollView>

				<View style={{ flexDirection: 'row', alignItems: 'center', padding: 8 }}>
					<TextInput
						style={{
							flex: 1,
							borderWidth: 1,
							borderColor: '#ccc',
							borderRadius: 5,
							marginRight: 10,
						}}
						value={inputValue}
						onChangeText={text => setInputValue(text)}
						placeholder="메세지를 입력해주세요"
					/>
					<TouchableOpacity onPress={() => handleSubmit(inputValue)}>
						<View
							style={{
								backgroundColor: currentTheme.color1,
								borderRadius: 5,
								padding: 5,
							}}>
							<Text style={{ color: 'white' }}>보내기</Text>
						</View>
					</TouchableOpacity>
				</View>
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

const Bar = styled.View`
    width: 100%;
    height: 1px;
    background-color: #B7BABF;
`;

export default Chatting;