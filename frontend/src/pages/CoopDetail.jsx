// 협업 페이지
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
import CoopTodo from "../components/CoopTodo.jsx";
import Memo from "../components/Memo.jsx";

const MainDiv = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 300px;
  margin-left: 300px;
  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
  }
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

function CoopDetail({ team, selectedDate }) {
  const [teamDetails, setTeamDetails] = useState(null); // 팀 상세 정보 상태
  const token = window.localStorage.getItem("token"); // 토큰 추가
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수

  // jwt토큰을 디코딩해서 userid를 가져오는 코드
  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };

  const fetchUserData = async userToken => {
    const userId = getUserIdFromToken(userToken); // 사용자 ID 가져오기
    try {
      const response = await axios.get(`/api/v1/userInfo/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
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

  const fetchTeamDetails = async teamId => {
    try {
      const response = await axios.get(`/api/v1/getUserTeam/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setTeamDetails(response.data); // 여기서 response.data에 teamId가 포함될 것입니다.
      }
    } catch (error) {
      console.error("Failed to fetch team details:", error);
    }
  };

  useEffect(() => {
    if (team && team.teamId) {
      // team 객체와 teamId 속성의 존재 여부를 확인합니다.
      fetchTeamDetails(team.teamId); // 올바른 teamId를 사용하여 팀 상세 정보를 불러옵니다.
      fetchUserData();
    }
  }, [team, token]); // team이 변경될 때마다 useEffect를 실행합니다.

  return (
    <ThemeProvider theme={currentTheme}>
      <MainDiv>
        <DateHeader>{team && team.teamTitle}</DateHeader>
        {/* 팀 상세 정보가 있으면 팀 이름을 표시하고, 없으면 로딩 텍스트를 표시한다. */}
        <CoopTodo
          teamId={team.teamId}
          onTodoChange={fetchTeamDetails}
          selectedDate={selectedDate}
        />
        <Memo teamId={team.teamId} />
      </MainDiv>
    </ThemeProvider>
    // Use 'team' prop to display team details
  );
}
export default CoopDetail;
