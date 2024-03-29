/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useLocation, useNavigate, Link } from "react-router-dom";
import axios from "axios"; // axios import 확인
import theme from "../styles/theme";
import NOTI from "../asset/KakaoTalk_20240105_025742662.png";
import STAR from "../asset/star.png";

const MainDiv = styled.div`
  //전체화면 테두리
  display: flex;
  flex-basis: auto;
  flex-direction: column; // 세로 나열
  align-items: center; // 가운데 놓기
  justify-content: center; // 가운데 놓기
  width: 100%;
  background-color: #333;
  height: 100vh;
`;

const MainTextBox = styled.div`
  // 텍스트 박스
  letter-spacing: 1px;
  color: ${props => props.theme.color1}; // 직접 테마의 color1 사용
  text-align: center;
  font-size: 40px;
  width: 100%;
  height: 30px;
  font-weight: normal;
`;

const WelBtn = styled.button`
  // 완료하기 버튼
  border: none;
  width: 350px;
  height: 40px;
  border-radius: 40px; // 모서리 둥굴게
  background-color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
  color: #ffffff;
  font-size: 12px; // 글씨크기
  font-weight: bold;
  letter-spacing: 1px; // 글자사이 간격
  margin-top: 80px;
  // transition: transform 80ms ease-in; // 부드럽게 전환
  text-align: center; // 텍스트 가운데 정렬
`;
const ImgBox = styled.div`
  // 이미지박스 div
  position: relative;
  width: 350px;
  height: 350px;
`;

const GestImgBox = styled.img`
  // 센터 이미지 박스
  position: absolute;
  width: 280px;
  height: 280px;
  margin-top: 60px;
  margin-bottom: 60px;
`;

function Welcome() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = window.localStorage.getItem("token"); // 토큰 추가
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태 변수
  const [userNickname, setUserNickname] = useState("사용자");

  // Base64 이미지 데이터를 저장할 상태
  const [base64Image, setBase64Image] = useState("");

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
        const userProfileImage = response.data.userProfile; // 사용자의 프로필 이미지
        setUserNickname(response.data.userNickname); // 사용자 닉네임 설정

        // 사용자의 테마를 상태에 적용
        if (theme[userThemeName]) {
          setCurrentTheme(theme[userThemeName]);
        }

        // 사용자의 프로필 이미지를 상태에 적용
        setBase64Image(userProfileImage);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, [token]);

  // 완료 버튼 클릭 핸들러
  const handleCompleteClick = () => {
    navigate("/main"); // 메인 페이지로 이동
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <div>
        <MainDiv>
          <MainTextBox
            style={{ color: currentTheme.color1, marginBottom: "20px" }}
          >
            프로필 생성 완료!
          </MainTextBox>
          <MainTextBox style={{ fontWeight: "700", color: "#ffffff" }}>
            {userNickname} 님! 노티에 오신 것을 환영해요
          </MainTextBox>
          <ImgBox>
            <GestImgBox
              src={base64Image || NOTI} // 기본값으로 NOTI 이미지 사용
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                boxShadow: "color: userColor",
              }}
            />
            <GestImgBox
              src={STAR}
              style={{
                top: "50%",
                left: "45%",
                transform: "translate(-50%, -50%)",
                width: "100%",
                height: "100%",
              }}
            />
          </ImgBox>
          <WelBtn
            onClick={handleCompleteClick}
            style={{ backgroundColor: currentTheme.color1 }}
          >
            완료
          </WelBtn>
        </MainDiv>
      </div>
    </ThemeProvider>
  );
}
export default Welcome;
