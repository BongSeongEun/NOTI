import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Navigate, useNavigate, Link } from "react-router-dom";
import Calendar from "react-calendar";
import axios from "axios"; // axios import
import USER from "../asset/userimage.png"; // 사용자 이미지 불러오기
import theme from "../styles/theme";
import NOTI from "../asset/KakaoTalk_20240126_160049425.png";
import "react-calendar/dist/Calendar.css"; // 로고 이미지를 가져옵니다.
import Todo from "../pages/Todo"; // Todo 컴포넌트 import
import Diary from "../pages/Diary"; // Diary 컴포넌트 import
import Coop from "../pages/Coop"; // Coop 컴포넌트 import
import Setting from "../pages/Setting"; // Setting 컴포넌트 import
import Stat from "../pages/Stat"; // Stat 컴포넌트 import
import CoopDetail from "../pages/CoopDetail";
import NavBar from "../components/Navigation";

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 2px;
    background: #ccc;
  }
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
  padding: 0 20px;
  height: 80px;
  position: fixed;
  width: 100%;
  z-index: 1;
`;

const Logo = styled.img`
  height: 50px; // 로고 이미지의 높이 설정
  width: auto;
`;

const Navigation = styled.nav`
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
  justify-content: right;
  padding-right: 40px;

  & > ul {
    display: flex;
    list-style: none;
    padding: 0;
    color: white;
  }

  & > ul > li {
    margin-left: 30px;
  }
`;

const Content = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
`;

const LeftSidebar = styled.aside`
  position: fixed; // 사이드바를 화면에 고정
  left: 0; // 오른쪽에 배치
  top: 80px; // 헤더 아래에 배치
  width: 300px; // 사이드바의 너비 설정
  height: calc(100vh - 80px); // 전체 높이에서 헤더 높이를 뺀 값
  background-color: #f9f9f9; // 배경색 설정
  /* border-left: 1px solid
    ${props => props.theme.color1 || theme.OrangeTheme.color1}; */
  overflow-y: auto; // 내용이 많을 경우 스크롤
  padding: 20px;
  box-sizing: border-box; // 패딩을 너비에 포함

  // 미디어 쿼리 추가
  @media (max-width: 1050px) {
    // 화면 너비가 1200px 이하일 때 적용
    display: none;
  }
`;

const MainContent = styled.section`
  flex-grow: 1;
  padding: 20px;
  margin-top: 80px;
  // margin-left: 300px; // 기본적으로 LeftSidebar의 너비만큼 여백을 둡니다.

  // 미디어 쿼리 추가
  @media (max-width: 1050px) {
    // LeftSidebar가 사라지는 화면 너비
    margin-left: 0; // LeftSidebar가 사라졌을 때 왼쪽 여백 제거
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;

const RightSidebar = styled.aside`
  position: fixed; // 사이드바를 화면에 고정
  right: 0; // 오른쪽에 배치
  top: 80px; // 헤더 아래에 배치
  width: 300px; // 사이드바의 너비 설정
  height: calc(100vh - 80px); // 전체 높이에서 헤더 높이를 뺀 값
  background-color: #f9f9f9; // 배경색 설정
  /* border-left: 1px solid
    ${props => props.theme.color1 || theme.OrangeTheme.color1}; */
  overflow-y: auto; // 내용이 많을 경우 스크롤
  padding: 20px;
  box-sizing: border-box; // 패딩을 너비에 포함
`;

const GreetingSection = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 2px solid ${props => props.theme.color1 || theme.OrangeTheme.color1};
  border-radius: 20px;
  padding: 20px;
  margin: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;
const UserProfileImage = styled.img`
  margin-left: 10px;
  border-radius: 50%;
  height: 40px;
  width: 40px;
  object-fit: cover;
  box-shadow: 0px 0px 10px 5px
    ${props => props.theme.color1 || theme.OrangeTheme.color1}; // 그림자 추가
  border: 3px solid ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

const GreetingText = styled.div`
  margin-left: 20px;
  display: flex; // 텍스트를 가로로 나열
  flex-direction: column; // 세로 나열 대신 가로 나열
  align-items: flex-start; // 텍스트 왼쪽 정렬
  justify-content: center; // 세로 중앙 정렬
  color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
  font-size: 15px; // 텍스트 크기 조절
`;

const StyledCalendar = styled(Calendar)`
  width: 100%;
  max-width: 300px; // 달력의 최대 너비를 설정
  background-color: white;
  border: 1px solid ${props => props.theme.color1 || theme.OrangeTheme.color1};
  border-radius: 10px; // 달력 모서리를 둥글게
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* font-family: Arial, sans-serif; // 글꼴 설정 */

  .react-calendar__navigation button {
    border-radius: 50%;
    color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
  }

  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus {
    border-radius: 50%;
    background-color: ${props =>
      props.theme.color1 || theme.OrangeTheme.color1};
  }

  /* 일요일에만 빨간 폰트 */
  .react-calendar__month-view__weekdays__weekday--weekend abbr[title="일요일"] {
    color: #c70000;
  }

  .react-calendar__tile--now {
    // 오늘 날짜 하이라이트 커스텀
    border-radius: 50%;
    background: ${props => props.theme.color2 || theme.OrangeTheme.color2};
    color: var(--festie-gray-800, #ffffff);
  }

  .react-calendar__month-view__weekdays abbr {
    // 요일 밑줄 제거
    text-decoration: none;
  }

  .react-calendar__month-view__days__day--weekend {
    color: inherit; // 주말 색상을 평일과 동일하게 설정
  }

  .react-calendar__tile--active {
    background-color: ${props =>
      props.theme.color2 || theme.OrangeTheme.color2};
    color: white;
    border-radius: 50%;
  }
`;

function Main() {
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
  const formatDay = (locale, date) => <span>{date.getDate()}</span>;
  const [userNickname, setUserNickname] = useState("사용자");
  const [selectedDate, setSelectedDate] = useState(new Date()); // 날짜 상태 추가
  const [selectedComponent, setSelectedComponent] = useState("Todo");
  const [diaryId, setDiaryId] = useState(null); // 선택된 일기의 ID 상태
  const token = window.localStorage.getItem("token"); // 토큰 추가
  const [selectedTeam, setSelectedTeam] = useState(null);
  // Base64 이미지 데이터를 저장할 상태
  const [base64Image, setBase64Image] = useState("");

  const handleMenuClick = component => {
    setSelectedComponent(component);
  };

  const handleSelectTeam = team => {
    setSelectedTeam(team);
    setSelectedComponent("CoopDetail");
  };

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
        if (!token) return; // 토큰이 없으면 종료

        // 사용자 ID 가져오기 (토큰에서 디코딩 또는 다른 방식으로)
        // const userId = getUserIdFromToken();

        const response = await axios.get(
          `http://15.164.151.130:4000/api/v1/userInfo/${userId}`,
          {
            // 사용자의 테마 정보를 가져오는 API 호출
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const userThemeName = response.data.userColor; // 사용자가 선택한 테마 이름
        const userProfileImage = response.data.userProfile; // 사용자의 프로필 이미지
        setUserNickname(response.data.userNickname); // 사용자 닉네임 설정

        if (userThemeName && theme[userThemeName]) {
          setCurrentTheme(theme[userThemeName]); // 가져온 테마로 상태 업데이트
        }

        // 사용자의 프로필 이미지를 상태에 적용
        setBase64Image(userProfileImage);
      } catch (error) {
        console.error("Error fetching user theme:", error);
      }
    }

    fetchUserData();
  }, [token]);

  const handleDateChange = value => {
    setSelectedDate(value); // Calendar에서 날짜가 변경될 때 상태 업데이트
  };

  // selectedComponent 상태를 'DiaryDetail'로 설정하는 함수를 Diary 컴포넌트에 전달합니다.
  const renderDiaryDetail = id => {
    setDiaryId(id);
    setSelectedComponent("DiaryDetail");
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Todo":
        return <Todo selectedDate={selectedDate} />;
      case "Diary":
        return <Diary onDiarySelect={setDiaryId} />;
      case "Coop":
        return (
          <Coop
            onSelectTeam={team => {
              setSelectedTeam(team); // 상태 업데이트 함수
              setSelectedComponent("CoopDetail");
            }}
          />
        );
      case "CoopDetail":
        return <CoopDetail team={selectedTeam} selectedDate={selectedDate} />;
      case "Stat":
        return <Stat selectedDate={selectedDate} />;
      case "Setting":
        return <Setting />;
      default:
        return <Todo />;
    }
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <PageLayout>
        <Header>
          {/* <NavBar /> */}
          <li
            onClick={() => handleMenuClick("Coop")}
            style={{ cursor: "pointer" }}
          >
            협업
          </li>
        </Header>
        <Content>
          <LeftSidebar>
            <GreetingSection>
              <UserProfileImage src={base64Image || USER} alt="User Profile" />
              <GreetingText>
                <div>{userNickname} 님,</div> {/* 홍길동 대신 사용자를 표시 */}
                <div style={{ color: "black" }}>반갑습니다!</div>
              </GreetingText>
            </GreetingSection>
            {/* 사이드바의 다른 내용 */}
          </LeftSidebar>
        </Content>
        <MainContent>
          {renderComponent()} {/* 선택된 컴포넌트 렌더링 */}{" "}
        </MainContent>
        <RightSidebar>
          <StyledCalendar
            onChange={handleDateChange}
            value={selectedDate}
            formatDay={formatDay}
          />
        </RightSidebar>
      </PageLayout>
    </ThemeProvider>
  );
}

export default Main;
