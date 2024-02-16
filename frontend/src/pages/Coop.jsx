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
import CoopDetail from "../pages/CoopDetail"; // 다른 파일에서 DiaryItem 컴포넌트를 import할 때;

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
  margin-bottom: 3px;
  height: 40px;
  width: 100%;
  color: black;
  border-bottom: 2px solid
    ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

const TeamList = styled.div`
  width: 80%;
  height: auto;
  padding: 10px;
  border-radius: 10px;
`;

const TeamItem = styled.div`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid ${props => props.theme.color1 || theme.OrangeTheme.color1};
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;
const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%; // 부모 컨테이너의 너비가 정의되어야 합니다.
`;

const AddTeamButton = styled.button`
  margin-right: 15px;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const TeamTitle = styled.h4`
  margin: 0;
  color: #333;
`;

const TeamDate = styled.div`
  margin-top: 5px;
  font-size: 0.8em;
  color: #666;
`;

// 모달 및 입력 필드 스타일 추가
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
`;

const InputField = styled.input`
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const CreateTeamButton = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.theme.color2 || theme.OrangeTheme.color2};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

function Coop({ onSelectTeam }) {
  const [teams, setTeams] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수
  const token = window.localStorage.getItem("token"); // 토큰 추가
  const [teamName, setTeamName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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

  // 팀 목록을 불러오는 함수
  const fetchTeams = async () => {
    const userId = getUserIdFromToken();
    try {
      const response = await axios.get(`/api/v1/getTeam/${userId}`);
      setTeams(response.data);
    } catch (error) {
      console.error("팀 목록을 불러오는데 실패했습니다:", error);
    }
  };

  const addTeam = async () => {
    try {
      await axios.post(
        `/api/v1/createTeam`,
        {
          teamTitle: teamName,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowModal(false);
      setTeamName("");
      // 팀 목록 다시 불러오기
      fetchTeams();
    } catch (error) {
      console.error("협업 팀 추가 실패:", error);
    }
  };

  // 팀을 클릭했을 때 onSelectTeam 함수 호출
  // Coop.jsx 내 handleTeamClick 함수 수정
  const handleTeamClick = team => {
    if (onSelectTeam && typeof onSelectTeam === "function") {
      onSelectTeam(team);
    } else {
      console.error("onSelectTeam is not a function");
    }
  };

  useEffect(() => {
    fetchUserData(token);
    fetchTeams();
  }, [token]);

  return (
    <ThemeProvider theme={currentTheme}>
      <MainDiv>
        <DateHeader>협업 목록</DateHeader>
        <ButtonContainer>
          <AddTeamButton onClick={() => setShowModal(true)}>
            + add Team
          </AddTeamButton>
        </ButtonContainer>
        {showModal && (
          <ModalBackdrop>
            <ModalContainer onClick={e => e.stopPropagation()}>
              <InputField
                type="text"
                placeholder="팀 이름 입력..."
                value={teamName}
                onChange={e => setTeamName(e.target.value)}
              />
              <CreateTeamButton onClick={addTeam}>생성</CreateTeamButton>
            </ModalContainer>
          </ModalBackdrop>
        )}
        <TeamList>
          {teams.map(team => (
            <TeamItem key={team.teamId} onClick={() => handleTeamClick(team)}>
              <TeamTitle>{team.teamTitle}</TeamTitle>
              <TeamDate>참여 인원 : </TeamDate>
            </TeamItem>
          ))}
        </TeamList>
      </MainDiv>
    </ThemeProvider>
  );
}

export default Coop;
