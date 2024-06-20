/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
import React from 'react';
import styled from 'styled-components/native';

const MessageContainer = styled.View`
	background-color: ${props => props.isUser ? props.userColor : '#E7E6E6'};
	padding: 10px;
	border-radius: 20px;
	margin: 5px 0;
	align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
	max-width: 70%;
	${props => props.isUser ? 'border-bottom-right-radius: 0;' : 'border-bottom-left-radius: 0;'}
`;

const MessageText = styled.Text`
	font-size: 10px;
  	color: ${props => props.isUser ? 'white' : 'black'};
`;

const ChatMessage = ({ message, isUser, userColor, date }) => {
	return (
		<MessageContainer isUser={isUser} userColor={userColor}>
			<MessageText isUser={isUser}>{message}</MessageText>
		</MessageContainer>
	);
};

export default ChatMessage;

