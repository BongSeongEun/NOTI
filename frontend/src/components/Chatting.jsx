import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";
import theme from "../styles/theme"; // 테마 파일 불러오기zz
import SEND from "../asset/fi-rr-paper-plane.png";

const ChatDiv = styled.div`
  border-radius: 10px;
  border: 2px solid ${props => props.theme.color1 || theme.OrangeTheme.color1}; // 새로운 스타일
  /* border: 3px solid black; */
  margin-top: 10px;
  height: 480px;
  /* justify-content: flex-end; // 아래 정렬 */
  /* justify-content: bottom; */
  display: flex;
  flex-direction: column;
  justify-content: space-between; // 채팅 입력란을 아래로 정렬

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  -ms-overflow-style: none;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const ChatInputDiv = styled.div`
  height: 35px;
  /* border-radius: 20px; */
  width: 100%; // 변경: 고정 폭 대신 부모 요소의 너비를 차지하도록 설정
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #e3e4e6;
  padding: 10px;
  box-sizing: border-box; // 패딩이 폭에 포함되도록 설정
`;

const ChatInput = styled.input`
  border: none;
  background-color: #e3e4e6; // 배경색 설정
  flex-grow: 1;
  padding: 5px;
`;

const ChatRole = styled.div`
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  &.bot-message {
    background-color: #e8e8e8; // 배경색 변경
    align-self: flex-start; // 왼쪽 정렬
    width: 200px;
    border-radius: 15px;
    padding: 10px;
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: 13px;
  }
  &.user-message {
    background-color: ${props =>
      props.theme.color1 || theme.OrangeTheme.color1}; // 배경색 변경
    color: white;
    font-weight: bold;
    border-radius: 15px;
    padding: 10px;
    font-size: 13px;
    align-self: flex-end; // 오른쪽 정렬
    margin-bottom: 10px;
    margin-top: 10px;
  }
`;
const SendButton = styled.img`
  padding: 10;
  cursor: pointer;
  width: 20px; // 버튼 크기 조정
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1; // 부모의 flex-direction이 column이므로 flex-grow를 사용하여 여분의 공간을 채웁니다.
  overflow-y: auto; // 이 부분에서 스크롤을 가능하게 합니다.
  padding: 10px; // 메시지와 컨테이너 가장자리 사이의 여백을 추가합니다.
  margin-bottom: 10px; // 입력란과의 간격을 유지합니다.
  transition: all 0.3s ease;
`;

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수

  const token = window.localStorage.getItem("token");
  const messagesEndRef = useRef(null); // 메시지 목록의 끝을 참조하기 위한 ref

  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };
  const userId = getUserIdFromToken();

  const fetchUserData = async userToken => {
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v1/userInfo/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );
      // 사용자의 테마 정보와 이미지 데이터를 서버로부터 받아옴
      const userThemeName = response.data.userColor; // 사용자의 테마 이름

      // 사용자의 테마를 상태에 적용
      if (theme[userThemeName]) {
        setCurrentTheme(theme[userThemeName]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // 메시지 목록의 끝으로 스크롤하는 함수
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // 채팅 컴포넌트를 클릭했을 때 실행될 핸들러
  const handleChatDivClick = () => {
    scrollToBottom();
  };

  const fetchChatList = async () => {
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v3/chatlist/${userId}`,
      );
      setMessages(response.data);
      scrollToBottom();
    } catch (error) {
      console.error("채팅 내역을 불러오는 중 오류가 발생했습니다.", error);
    }
  };

  // 채팅 내역 불러오기
  useEffect(() => {
    fetchUserData();
    fetchChatList();
  }, [newMessage]); // messages가 변경될 때마다 이 effect를 실행

  // 새 채팅 메시지 전송
  const sendMessage = async event => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://15.164.151.130:4000/api/v3/ask/${userId}`,
        {
          chat_content: newMessage,
          chatWho: false, // 예시로, 사용자 메시지로 설정
        },
      );
      setMessages(prevMessages => [
        ...prevMessages,
        { chat_content: newMessage, chatWho: false },
        { chat_content: response.data.chat_content, chatWho: true },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("메시지 전송 중 오류가 발생했습니다.", error);
    }
  };

  // 메시지를 보내는 함수에 Enter 키 이벤트 추가
  const handleKeyPress = event => {
    if (event.key === "Enter") {
      sendMessage(event);
    }
  };

  const scrollRef = useRef();
  console.log(scrollRef.current);

  return (
    <ThemeProvider theme={currentTheme}>
      <ChatDiv>
        <MessagesContainer>
          {messages.map((msg, index) => (
            <ChatRole
              key={index}
              className={msg.chatWho ? "bot-message" : "user-message"}
            >
              {msg.chatContent}
            </ChatRole>
          ))}
          <div ref={messagesEndRef} />
        </MessagesContainer>
        <ChatInputDiv>
          <ChatInput
            onClick={handleChatDivClick}
            type="text"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="노티에게 보낼 내용을 입력하세요!"
          />
          <SendButton src={SEND} alt="보내기" onClick={sendMessage} />
        </ChatInputDiv>
      </ChatDiv>
    </ThemeProvider>
  );
}

export default ChatComponent;
