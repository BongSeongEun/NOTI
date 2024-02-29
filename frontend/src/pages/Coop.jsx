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
import Confirm from "../asset/fi-rr-sign-out.png"; //
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
  justify-content: center;
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
  display: flex;
  justify-content: space-between; // 내용을 양 끝으로 정렬
  align-items: center; // 세로 중앙 정렬
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
  margin-left: 10px;
  margin-top: 0px;
  margin-bottom: 0px;
  color: #333;
`;

const TeamDate = styled.div`
  margin-left: 10px;
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
  justify-content: center;
  align-items: center;
  @media (max-width: 1050px) {
    // LeftSidebar가 사라지는 화면 너비
    margin-right: 300px; // LeftSidebar가 사라졌을 때 왼쪽 여백 제거
  }
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

const CloseButton = styled.button`
  align-self: flex-end;
`;

const LeaveTeamButton = styled.img`
  margin-right: 10px;
  cursor: pointer;
  width: 17px;
  height: 17px;
`;

const ConfirmModalBackdrop = styled(ModalBackdrop)``; // 이미 정의된 ModalBackdrop 사용

const ConfirmModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center; // 가운데 놓기
  flex-direction: column;
  gap: 10px;
`;

const ConfirmButtonContainer = styled.div`
  display: flex;
  justify-content: center; // 버튼을 가운데 정렬
  gap: 10px; // 버튼 사이의 간격
`;

const ConfirmMessage = styled.p`
  margin-bottom: 20px;
`;

const ConfirmButton = styled.button`
  color: white;
  padding: 10px 20px;
  background-color: ${props => props.theme.color2 || theme.OrangeTheme.color2};
  width: 100px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

const CancelButton = styled(ConfirmButton)`
  background-color: #ccc; // 회색 계열
`;

const TeamInfo = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

function Coop({ onSelectTeam }) {
  const [teams, setTeams] = useState([]);
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수
  const token = window.localStorage.getItem("token"); // 토큰 추가
  const [teamName, setTeamName] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showEnterModal, setShowEnterModal] = useState(false);
  const [teamMembersCount, setTeamMembersCount] = useState({});
  const navigate = useNavigate();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
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

  const handleLeaveTeamClick = teamId => {
    setShowConfirmModal(true);
    setSelectedTeamId(teamId);
  };

  const fetchUserData = async userToken => {
    const userId = getUserIdFromToken(userToken); // 사용자 ID 가져오기
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

  // 팀 목록을 불러오는 함수
  const fetchTeams = async () => {
    const userId = getUserIdFromToken();
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v1/getTeam/${userId}`,
      );
      setTeams(response.data);
    } catch (error) {
      console.error("팀 목록을 불러오는데 실패했습니다:", error);
    }
  };

  const addTeam = async () => {
    const userId = getUserIdFromToken();
    try {
      await axios.post(
        `http://15.164.151.130:4000/api/v1/createTeam/${userId}`,
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

  const enterTeam = async teamId => {
    const userId = getUserIdFromToken();
    try {
      await axios.post(
        `http://15.164.151.130:4000/api/v1/enterTeam/${userId}/${teamId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setShowEnterModal(false);
      setTeamCode("");
      // 팀 목록 다시 불러오기
      fetchTeams();
    } catch (error) {
      console.error("협업 팀 추가 실패:", error);
    }
  };

  // 팀을 클릭했을 때 onSelectTeam 함수 호출
  // Coop.jsx 내 handleTeamClick 함수 수정
  const handleTeamClick = team => {
    navigate(`/Coop/${team.teamId}`);
  };

  // 특정 팀에 속한 사용자 수를 불러오는 함수
  const fetchTeamMembers = async teamId => {
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v1/getUserTeam/${teamId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setTeamMembersCount(prevState => ({
        ...prevState,
        [teamId]: response.data.length,
      }));
    } catch (error) {
      console.error("팀 참여 인원 수를 불러오는데 실패했습니다:", error);
    }
  };
  // 모달을 닫는 함수
  const closeModal = () => {
    setShowModal(false);
    setTeamName("");
  };

  const closeEnterModal = () => {
    setShowEnterModal(false);
    setTeamCode("");
  };

  useEffect(() => {
    fetchUserData();
    fetchTeams();
  }, [token]);

  useEffect(() => {
    // 각 팀에 대한 사용자 수를 불러옵니다.
    teams.forEach(team => {
      fetchTeamMembers(team.teamId);
    });
  }, [teams]);

  const leaveTeam = async teamId => {
    const userId = getUserIdFromToken();
    try {
      await axios.delete(
        `http://15.164.151.130:4000/api/v1/leaveTeam/${teamId}/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setShowConfirmModal(false);
      fetchTeams(); // 팀 목록 다시 불러오기
    } catch (error) {
      console.error("팀 나가기 실패:", error);
    }
  };

  const closeModalAndReset = () => {
    setShowConfirmModal(false);
    setSelectedTeamId(null);
  };
  const setDate = date => {
    setSelectedDate(date);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <NavBar setDate={setDate} />
      <div style={{ alignItems: "center" }}>
        <MainDiv>
          <DateHeader>협업 목록</DateHeader>
          <ButtonContainer>
            <AddTeamButton onClick={() => setShowModal(true)}>
              + add Team
            </AddTeamButton>
            <AddTeamButton onClick={() => setShowEnterModal(true)}>
              팀에 참여하기
            </AddTeamButton>
          </ButtonContainer>
          {showModal && (
            <ModalBackdrop onClick={closeModal}>
              <ModalContainer onClick={e => e.stopPropagation()}>
                <CloseButton
                  onClick={closeModal}
                  style={{
                    border: "none",
                    backgroundColor: "white",
                    marginBottom: "5px",
                  }}
                >
                  x
                </CloseButton>
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
          {showEnterModal && (
            <ModalBackdrop onClick={closeEnterModal}>
              <ModalContainer onClick={e => e.stopPropagation()}>
                <CloseButton
                  onClick={closeEnterModal}
                  style={{
                    border: "none",
                    backgroundColor: "white",
                    marginBottom: "5px",
                  }}
                >
                  x
                </CloseButton>
                <InputField
                  type="text"
                  placeholder="팀 코드 입력..."
                  value={teamCode}
                  onChange={e => setTeamCode(e.target.value)}
                />
                <CreateTeamButton onClick={() => enterTeam(teamCode)}>
                  참여
                </CreateTeamButton>
              </ModalContainer>
            </ModalBackdrop>
          )}
          <TeamList>
            {teams.map(team => (
              <TeamItem key={team.teamId}>
                <TeamInfo onClick={() => handleTeamClick(team)}>
                  <TeamTitle>{team.teamTitle}</TeamTitle>
                  <TeamDate>
                    참여 인원 : {teamMembersCount[team.teamId] || "로딩 중..."}{" "}
                    명
                  </TeamDate>
                </TeamInfo>
                <LeaveTeamButton
                  src={Confirm}
                  alt="팀 나가기"
                  onClick={() => handleLeaveTeamClick(team.teamId)}
                />
              </TeamItem>
            ))}
            {showConfirmModal && (
              <ConfirmModalBackdrop>
                <ConfirmModalContainer onClick={e => e.stopPropagation()}>
                  <ConfirmMessage>Team을 나가시겠습니까?</ConfirmMessage>
                  <ConfirmButtonContainer>
                    <ConfirmButton onClick={() => leaveTeam(selectedTeamId)}>
                      나가기
                    </ConfirmButton>
                    <CancelButton onClick={closeModalAndReset}>
                      취소
                    </CancelButton>
                  </ConfirmButtonContainer>
                </ConfirmModalContainer>
              </ConfirmModalBackdrop>
            )}
          </TeamList>
        </MainDiv>
      </div>
    </ThemeProvider>
  );
}

export default Coop;
