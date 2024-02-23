import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";
import theme from "../styles/theme"; // 테마 파일 불러오기

const ChatDiv = styled.div`
  /* border: 3px solid black; */
  margin-top: 10px;
  height: 500px;
  justify-content: bottom;
  align-items: bottom;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  -ms-overflow-style: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const ChatInput = styled.input`
  border-radius: 1px;
  margin-top: 10px;
  z-index: 1;
  border: 1px solid ${props => props.color || theme.OrangeTheme};
`;
const ChatRole = styled.div`
  &.bot-message {
    background-color: skyblue;
    width: 200px;
    border-radius: 15px;
    padding: 10px;
    font-size: 12px;
  }
  &.user-message {
    background-color: yellow;
    border-radius: 15px;
    padding: 10px;
    font-size: 12px;
    align-items: right;
    justify-content: right;
    margin-bottom: 15px;
    margin-top: 15px;
    display: inline-block;
  }
`;

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const token = window.localStorage.getItem("token");

  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };
  const userId = getUserIdFromToken();

  const fetchChatList = async () => {
    try {
      const response = await axios.get(`/api/v3/chatlist/${userId}`);
      setMessages(response.data);
    } catch (error) {
      console.error("채팅 내역을 불러오는 중 오류가 발생했습니다.", error);
    }
  };
  // 채팅 내역 불러오기
  useEffect(() => {
    fetchChatList();
  }, [userId]);

  // 새 채팅 메시지 전송
  const sendMessage = async event => {
    event.preventDefault();
    try {
      const response = await axios.post(`/api/v3/ask/${userId}`, {
        chat_content: newMessage,
        chatWho: false, // 예시로, 사용자 메시지로 설정
      });
      setMessages([
        ...messages,
        { chat_content: newMessage, chatWho: false },
        { chat_content: response.data, chatWho: true },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <ChatDiv>
      <ChatDiv>
        {messages.map((msg, index) => (
          <ChatRole
            key={index}
            className={msg.chatWho ? "bot-message" : "user-message"}
          >
            {msg.chatContent}
          </ChatRole>
        ))}
      </ChatDiv>
      <form style={{ zIndex: "1" }} onSubmit={sendMessage}>
        <ChatInput
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요"
        />
        <button type="submit">전송</button>
      </form>
    </ChatDiv>
  );
}

export default ChatComponent;
