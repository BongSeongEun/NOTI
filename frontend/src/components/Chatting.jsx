import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";

const ChatDiv = styled.div`
  border: 3px solid black;
  margin-top: 10px;
  height: 500px;
  justify-content: bottom;
  align-items: bottom;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const ChatInput = styled.input`
  border-radius: 1px;
  margin-top: 10px;
  z-index: 1;
`;

function ChatComponent({ userId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
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
  }, []);

  // 새 채팅 메시지 전송
  const sendMessage = async event => {
    event.preventDefault();
    try {
      const response = await axios.post(`/api/v3/ask/${userId}`, {
        chat_content: newMessage,
        chat_role: false, // 예시로, 사용자 메시지로 설정
      });
      setMessages([
        ...messages,
        { chat_content: newMessage, isBot: false },
        { chat_content: response.data, isBot: true },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 중 오류가 발생했습니다.", error);
    }
  };

  return (
    <ChatDiv>
      <h2>채팅</h2>
      <ChatDiv>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={msg.isBot ? "bot-message" : "user-message"}
          >
            {msg.chat_content}
          </div>
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
