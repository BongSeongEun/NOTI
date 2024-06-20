// 첫화면 로그인하기 페이지

/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import NOTI from "../asset/KakaoTalk_20240105_025742662.png";
import NAVER from "../asset/NAVER.png";
import GOOGLE from "../asset/GOOGLE.png";
import KAKAO from "../asset/KAKAO.png";

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
  background-color: #ffffff;
  height: 100vh;
`;

const KakaoText = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  border-radius: 20px;
  font-size: 18px;
  width: 300px;
  height: 3.5rem;
  background-color: #fddc3f;
`;

const MainLogo = styled.img`
  width: 10rem;
  height: 13rem;
  padding: 1.2rem;
`;

const SocialImg = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 3rem;
  margin-right: 10px;
`;
const SocialWrap = styled.div`
  height: 50px;
  width: 200px;
  text-align: center;
  display: flex;
  flex-direction: column;
`;
const LoginImage = styled.image`
  width: 30px;
  height: 30px;
`;

const StyledLink = styled.a`
  text-decoration: none; // 링크의 밑줄 없애기
  color: inherit; // 상위 요소의 글자 색상 상속받기
`;
function Login() {
  const [message, setMassege] = useState([]);
  const REACT_APP_REST_API_KEY = "77cf97c36317f2622a926b9ddb30f96f";
  const REACT_APP_REDIRECT_URI = "http://15.165.100.226:3000/auth";
  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REACT_APP_REST_API_KEY}&redirect_uri=${REACT_APP_REDIRECT_URI}&response_type=code`;
  const handleLogin = () => {
    window.location.href = kakaoURL;
  };

  useEffect(() => {
    fetch("http://15.164.151.130:4000/api/v1/welcome")
      .then(response => response.json())
      .then(data => {
        setMassege(data);
      });
  }, []);

  return (
    <>
      <MainDiv>
        <MainLogo src={NOTI} />
        <h1>{message}</h1>

        <StyledLink href={kakaoURL}>
          <KakaoText>
            <SocialImg src={KAKAO} />
            <div>카카오 계정으로 로그인</div>
          </KakaoText>
        </StyledLink>
      </MainDiv>
    </>
  );
}

export default Login;
