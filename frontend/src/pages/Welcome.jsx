/* eslint-disable no-unused-vars */
import React from "react";
import styled from "styled-components";
import { Navigate, useNavigate, Link } from "react-router-dom";
import NOTI from "../asset/KakaoTalk_20240105_025742662.png";

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
  color: #ffffff;
  text-align: center;
  font-size: 40px;
  width: 100%;
  height: 30px;
  font-weight: normal;
`;

const WelBtn = styled.button`
  // 완료하기 버튼
  width: 350px;
  height: 40px;
  border-radius: 40px; // 모서리 둥굴게
  background-color: #ff7154;
  color: #ffffff;
  font-size: 12px; // 글씨크기
  font-weight: bold;
  letter-spacing: 1px; // 글자사이 간격
  // transition: transform 80ms ease-in; // 부드럽게 전환
  text-align: center; // 텍스트 가운데 정렬
`;
const MainLogo = styled.img`
  //토끼로고
  width: 300px;
  height: 400px;
`;

function Welcome() {
  const navigate = useNavigate();
  return (
    <div>
      <MainDiv>
        <MainTextBox
          style={{ fontSize: "30px", color: "#ff7154", marginBottom: "30px" }}
        >
          프로필 생성 완료!
        </MainTextBox>
        <MainTextBox style={{ fontWeight: "700" }}>
          홍길동 님! 노티에 오신 것을 환영해요
        </MainTextBox>
        <MainLogo
          style={{
            height: "280px",
            width: "280px",
            borderRadius: "50%",
            marginTop: "60px",
            marginBottom: "60px",
            boxShadow: "0px 0px 30px 5px #ff7154 ",
          }}
          src={NOTI}
          alt="로고"
        />
        <Link to="/main">
          <WelBtn>완료</WelBtn>
        </Link>
      </MainDiv>
    </div>
  );
}
export default Welcome;
