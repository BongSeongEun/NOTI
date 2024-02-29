/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
import styled from 'styled-components/native';

import React, {useState, useEffect } from 'react';
import {View, Text} from 'react-native';
import axios from 'axios';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';

const Style = styled.View`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 675px;
	width: 400px;
	max-width: 800px;
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	padding: 16px;
`; 

const ChatDiv = styled.View`
	display: flex;
	flex-direction: column;
	flex: 1;
	overflow-y: auto;
	padding: 8px;
`;

function Chatting() {
	const [messages, setMessages] = useState([]);
	const [token, setToken] = useState('');

	const addMessage = (message, isUser) => {
		setMessages(prevMessages => [...prevMessages, { text: message, isUser }]);
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

	const handleSubmit = async message => {
		addMessage(message, true);
		const storedToken = await AsyncStorage.getItem('token');
		if (!storedToken) return;
		
		try {
			const userId = getUserIdFromToken(storedToken);
			const response = await axios.post(`http://15.164.151.130:4000/api/v3/ask/${userId}`, {
				chat_content: message,
			});
			if (response.data) {
				addMessage(response.data, false);
			}
		} catch (error) {
			console.error('Error fetching Gpt response: ', error);
		}
	};

	return (
		<View>
			<Style>
				<ChatDiv>
					{messages.map((message, index) => (
						<ChatMessage
							key={index}
							message={message.text}
							isUser={message.isUser}
						/>
					))}
				</ChatDiv>
				<ChatInput onSubmit={handleSubmit} />
			</Style>
		</View>
	);
}

export default Chatting;
