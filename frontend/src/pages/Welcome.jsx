/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState } from "react";
import styled from "styled-components";
import { Navigate, useNavigate, Link } from "react-router-dom";
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
  color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
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
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태 변수
  const userColor =
    localStorage.getItem("userColor") || theme.OrangeTheme.color1;

  return (
    <div>
      <MainDiv>
        <MainTextBox style={{ color: userColor, marginBottom: "20px" }}>
          프로필 생성 완료!
        </MainTextBox>
        <MainTextBox style={{ fontWeight: "700", color: "#ffffff" }}>
          홍길동 님! 노티에 오신 것을 환영해요
        </MainTextBox>
        <ImgBox>
          <GestImgBox
            src={NOTI}
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
        <Link to="/main">
          <WelBtn style={{ backgroundColor: userColor }}>완료</WelBtn>
        </Link>
      </MainDiv>
    </div>
  );
}
export default Welcome;
