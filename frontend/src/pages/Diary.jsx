// 일기/달력 페이지
import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDropzone, open } from "react-dropzone";
import {
  Navigate,
  useNavigate,
  Link,
  Toggle,
  redirect,
} from "react-router-dom";
import { backgrounds, lighten } from "polished";
import { format } from "date-fns"; // 날짜 포맷을 위한 라이브러리
import axios from "axios";
import theme from "../styles/theme"; // 테마 파일 불러오기
import DiaryList from "../components/DiaryList"; // 다른 파일에서 DiaryItem 컴포넌트를 import할 때
import NavBar from "../components/Navigation";

const MainDiv = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 350px;
  margin-left: 350px;
  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
  }
  padding-top: 140px;
`;
const DateHeader = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  height: 40px;
  width: 100%;
  color: black;
  border-bottom: 2px solid
    ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

function Diary() {
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수
  const token = window.localStorage.getItem("token"); // 토큰 추가
  const [selectedDate, setSelectedDate] = useState("");

  // jwt토큰을 디코딩해서 userid를 가져오는 코드
  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };

  useEffect(() => {
    async function fetchUserData() {
      const userId = getUserIdFromToken(); // 사용자 ID 가져오기
      try {
        const response = await axios.get(
          `http://15.164.151.130:4000/api/v1/userInfo/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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
    }

    fetchUserData();
  }, [token]);

  const setDate = date => {
    setSelectedDate(date);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <NavBar setDate={setDate} />

      <MainDiv>
        <DateHeader>노티의 하루 일기</DateHeader>
        <DiaryList />
      </MainDiv>
    </ThemeProvider>
  );
}

export default Diary;
