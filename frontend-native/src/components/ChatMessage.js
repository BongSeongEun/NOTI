/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';

const ChatView = styled.View`
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
  margin-bottom: ${(props) => (props.isUser ? '8px' : '0')};
`;

const UserMessage = styled(ChatView)`
  align-self: flex-end;
  background-color: #d2ebff;
  border-radius: 10px;
  padding: 8px;
  max-width: 60%;
`;

const BotMessage = styled(ChatView)`
  align-self: flex-start;
  background-color: #f1f1f1;
  border-radius: 10px;
  padding: 8px;
  max-width: 60%;
`;

const ChatMessage = ({ message, isUser }) => {
  return (
    <View>
      {isUser ? (
        <UserMessage>
          <Text>{message}</Text>
        </UserMessage>
      ) : (
        <BotMessage>
          <Text>{message}</Text>
        </BotMessage>
      )}
    </View>
  );
};

export default ChatMessage;
