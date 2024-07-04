import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";
import theme from "../styles/theme"; // 테마 파일 불러오기
import SEND from "../asset/fi-rr-paper-plane.png";

const ChatDiv = styled.div`
  border-radius: 10px;
  border: 2px solid ${props => props.theme.color1 || theme.OrangeTheme.color1};
  margin-top: 10px;
  height: 480px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const ChatInputDiv = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #e3e4e6;
  padding: 10px;
  box-sizing: border-box;
`;

const ChatInput = styled.input`
  font-size: 12px;
  border: none;
  background-color: #e3e4e6;
  flex-grow: 1;
  padding: 5px;
  outline: none; /* 기본 테두리 없애기 */
  &:focus {
    border-radius: 5px;
    border: 2px solid ${props => props.theme.color1 || theme.OrangeTheme.color1}; /* 포커스 시 테두리 색상 변경 */
  }
`;

const ChatRole = styled.div`
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.2);
  &.bot-message {
    background-color: #e8e8e8;
    align-self: flex-start;
    max-width: 80%;
    border-radius: 15px 15px 15px 0px;
    padding: 10px;
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: 13px;
    position: relative;
  }
  &.user-message {
    background-color: ${props =>
      props.theme.color1 || theme.OrangeTheme.color1};
    color: white;
    border-radius: 15px 15px 0px 15px;
    padding: 10px;
    font-size: 13px;
    align-self: flex-end;
    margin-bottom: 10px;
    margin-top: 10px;
    max-width: 80%;
    position: relative;
  }
`;

const Timestamp = styled.span`
  font-size: 10px;
  color: #a0a0a0;
  position: absolute;
  bottom: -15px;
  ${props => (props.isBot ? "left: 6px;" : "right: 3px;")}
  width: 50px;
`;

const DateSeparator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 10px 0;
  font-size: 12px;
  color: #a0a0a0;
  &:before,
  &:after {
    content: "";
    flex: 1;
    border-bottom: 1px solid #a0a0a0;
    margin: 0 10px;
  }
`;

const SendButton = styled.img`
  padding: 10px;
  cursor: pointer;
  width: 20px;
  transition: transform 0.2s ease; /* 부드러운 전환 효과 */
  &:hover {
    transform: scale(1.2); /* 크기를 1.2배로 확대 */
  }
`;

const MessagesContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: auto; // 스크롤 가능
  padding: 10px;
  margin-bottom: 10px;
  transition: all 0.3s ease;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);

  const token = window.localStorage.getItem("token");
  const messagesEndRef = useRef(null);

  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

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
      const userThemeName = response.data.userColor;

      if (theme[userThemeName]) {
        setCurrentTheme(theme[userThemeName]);
      }
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChatDivClick = () => {
    scrollToBottom();
  };

  const fetchChatList = async () => {
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v3/chatlist/${userId}`,
      );
      const messagesWithKST = response.data.map(message => ({
        ...message,
        chatDate: new Date(
          new Date(message.chatDate).getTime() + 9 * 60 * 60 * 1000,
        ).toISOString(),
      }));
      setMessages(messagesWithKST);
      scrollToBottom();
    } catch (error) {
      console.error("채팅 내역을 불러오는 중 오류가 발생했습니다.", error);
    }
  };

  useEffect(() => {
    fetchUserData(token);
    fetchChatList();
    scrollToBottom();
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [token]);

  const sendMessage = async event => {
    event.preventDefault();
    try {
      const response = await axios.post(
        `http://15.164.151.130:4000/api/v3/ask/${userId}`,
        {
          chat_content: newMessage,
          chatWho: false,
        },
      );
      const now = new Date();
      const nowKST = new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString();
      setMessages(prevMessages => [
        ...prevMessages,
        { chat_content: newMessage, chatWho: false, chatDate: nowKST },
        {
          chat_content: response.data.chat_content,
          chatWho: true,
          chatDate: nowKST,
        },
      ]);
      setNewMessage("");
      fetchUserData(token);
      fetchChatList();
    } catch (error) {
      console.error("메시지 전송 중 오류가 발생했습니다.", error);
    }
  };

  const handleKeyPress = event => {
    if (event.key === "Enter") {
      sendMessage(event);
    }
  };

  const formatDate = date => {
    const options = { year: "numeric", month: "numeric", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <ChatDiv>
        <MessagesContainer>
          {messages.map((msg, index) => {
            const showDateSeparator =
              index === 0 ||
              formatDate(messages[index - 1].chatDate) !==
                formatDate(msg.chatDate);
            return (
              <React.Fragment key={index}>
                {showDateSeparator && (
                  <DateSeparator>{formatDate(msg.chatDate)}</DateSeparator>
                )}
                <ChatRole
                  className={msg.chatWho ? "bot-message" : "user-message"}
                >
                  {msg.chatContent}
                  <Timestamp isBot={msg.chatWho}>
                    {new Date(msg.chatDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Timestamp>
                </ChatRole>
              </React.Fragment>
            );
          })}
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
