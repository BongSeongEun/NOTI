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

const MainLogo = styled.img`
  width: 10rem;
  height: 13rem;
  padding: 1.2rem;
`;

const SocialImg = styled.img`
  margin-top: 10px;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 3rem;
`;
const SocialWrap = styled.div`
  flex-direction: row;
`;
const LoginImage = styled.image`
  width: 30px;
  height: 30px;
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
        <SocialWrap>
          <a href={kakaoURL}>
            <SocialImg src={KAKAO} />
          </a>
        </SocialWrap>
      </MainDiv>
    </>
  );
}

export default Login;
