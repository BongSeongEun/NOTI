import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";
import Calendar from "react-calendar";
import theme from "../styles/theme";
import USER from "../asset/userimage.png"; // 사용자 이미지 불러오기
import NOTI from "../asset/KakaoTalk_20240126_160049425.png";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
  justify-content: right;
  padding-right: 40px;
  background-color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

const NavLink = styled(Link)`
  text-decoration: none;
  margin: 1.1rem;
  font-size: 17px;
  color: white;
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

const Logo = styled.img`
  height: 50px; // 로고 이미지의 높이 설정
  width: auto;
  margin-right: 103rem;
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

function Navigation() {
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
  const token = window.localStorage.getItem("token");
  const [base64Image, setBase64Image] = useState("");
  const [userNickname, setUserNickname] = useState("사용자");
  const [selectedDate, setSelectedDate] = useState(new Date()); // 날짜 상태 추가
  const formatDay = (locale, date) => <span>{date.getDate()}</span>;

  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };

  useEffect(() => {
    async function themeSelec() {
      const userId = getUserIdFromToken();
      const response = await axios.get(`/api/v1/userInfo/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userThemeName = response.data.userColor; // 사용자가 선택한 테마 이름
      const userProfileImage = response.data.userProfile; // 사용자의 프로필 이미지
      setUserNickname(response.data.userNickname); // 사용자 닉네임 설정

      if (userThemeName && theme[userThemeName]) {
        setCurrentTheme(theme[userThemeName]); // 가져온 테마로 상태 업데이트
      }

      // 사용자의 프로필 이미지를 상태에 적용
      setBase64Image(userProfileImage);
    }
    themeSelec();
  }, [token]);

  const handleDateChange = value => {
    setSelectedDate(value); // Calendar에서 날짜가 변경될 때 상태 업데이트
  };

  return (
    <>
      <Nav>
        <Logo src={NOTI} alt="NOTI Logo" />
        <NavLink>
          <NavLink to={"/Todo"}>일정</NavLink>
          <NavLink to={"/Todo"}>협업</NavLink>
          <NavLink to={"/Todo"}>일기</NavLink>
          <NavLink to={"/Todo"}>설정</NavLink>
        </NavLink>
      </Nav>
      <LeftSidebar>
        <GreetingSection>
          <UserProfileImage src={base64Image || USER} alt="User Profile" />
          <GreetingText>
            <div>{userNickname} 님,</div> {/* 홍길동 대신 사용자를 표시 */}
            <div style={{ color: "black" }}>반갑습니다!</div>
          </GreetingText>
        </GreetingSection>
      </LeftSidebar>
      <RightSidebar>
        <StyledCalendar
          onChange={handleDateChange}
          value={selectedDate}
          formatDay={formatDay}
        />
      </RightSidebar>
    </>
  );
}
export default Navigation;
