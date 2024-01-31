import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import Calendar from "react-calendar";
import USER from "../asset/userimage.png"; // 사용자 이미지 불러오기
import theme from "../styles/theme";
import NOTI from "../asset/KakaoTalk_20240105_025742662.png";
import "react-calendar/dist/Calendar.css"; // 로고 이미지를 가져옵니다.
import Todo from "../pages/Todo"; // Todo 컴포넌트 import
import Diary from "../pages/Diary"; // Diary 컴포넌트 import
import Coop from "../pages/Coop"; // Coop 컴포넌트 import
import Setting from "../pages/Setting"; // Setting 컴포넌트 import
import Stat from "../pages/Stat"; // Stat 컴포넌트 import

const PageLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
  padding: 0 20px;
  height: 80px;
`;

const Logo = styled.img`
  height: 50px; // 로고 이미지의 높이 설정
  width: auto;
`;

const Navigation = styled.nav`
  display: flex;

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
`;

const MainContent = styled.section`
  flex-grow: 1;
  padding: 20px;
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
      props.theme.color2 || theme.OrangeTheme.color2};
    border-radius: 50%;
  }

  .react-calendar__month-view__days__day--weekend {
    // 주말 글씨 빨간색 없애기
    color: var(--festie-gray-800, #000000);
  }

  .react-calendar__tile--now {
    // 오늘 날짜 하이라이트 커스텀
    border-radius: 50%;
    background: ${props => props.theme.color2 || theme.OrangeTheme.color2};
    color: var(--festie-gray-800, #ffffff);
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
  const [nickname] = useState("사용자");
  const [selectedDate, setSelectedDate] = useState(new Date()); // 날짜 상태 추가
  const [selectedComponent, setSelectedComponent] = useState("Todo");
  const handleMenuClick = component => {
    setSelectedComponent(component);
  };

  const handleDateChange = value => {
    setSelectedDate(value); // Calendar에서 날짜가 변경될 때 상태 업데이트
  };

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Todo":
        return <Todo selectedDate={selectedDate} />;
      case "Diary":
        return <Diary />;
      case "Coop":
        return <Coop />;
      case "Stat":
        return <Stat />;
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
          <Logo src={NOTI} alt="NOTI Logo" /> {/* 로고 이미지를 삽입합니다. */}
          <Navigation>
            <ul>
              <li
                onClick={() => handleMenuClick("Todo")}
                style={{ cursor: "pointer" }}
              >
                일정
              </li>
              <li
                onClick={() => handleMenuClick("Coop")}
                style={{ cursor: "pointer" }}
              >
                협업
              </li>
              <li
                onClick={() => handleMenuClick("Diary")}
                style={{ cursor: "pointer" }}
              >
                달력/일기
              </li>
              <li
                onClick={() => handleMenuClick("Stat")}
                style={{ cursor: "pointer" }}
              >
                통계
              </li>
              <li
                onClick={() => handleMenuClick("Setting")}
                style={{ cursor: "pointer" }}
              >
                설정
              </li>
            </ul>
          </Navigation>
        </Header>
        <Content>
          <LeftSidebar>
            <GreetingSection>
              <UserProfileImage src={USER} alt="User Profile" />
              <GreetingText>
                <div>{nickname} 님,</div> {/* 홍길동 대신 사용자를 표시 */}
                <div style={{ color: "black" }}>반갑습니다!</div>
              </GreetingText>
            </GreetingSection>
            {/* 사이드바의 다른 내용 */}
          </LeftSidebar>
          <MainContent>
            {renderComponent()} {/* 선택된 컴포넌트 렌더링 */}{" "}
          </MainContent>
        </Content>
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
