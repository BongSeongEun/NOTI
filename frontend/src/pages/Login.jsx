/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from "styled-components";
import NOTI from '../asset/KakaoTalk_20240105_025742662.png';
import NAVER from '../asset/NAVER.png';
import GOOGLE from '../asset/GOOGLE.png';
import KAKAO from '../asset/KAKAO.png';

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
  background-color: #F9F9F9;
  height: 100vh;
  display: flex;
`;

const Mainlogo = styled.img`
  width: 10rem;
  height: 13rem;
  padding: 1.2rem;
`;

const SocialImg = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 3rem;
`;
const SocialWrap = styled.div`
  flex-direction: row;
`
const LoginImage = styled.image`
  width: 30px;
  height: 30px;
`
function Login() {
  const [message, setMassege] = useState([]);
  const REACT_APP_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY
  const REACT_APP_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI
  // oauth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REACT_APP_REST_API_KEY}&redirect_uri=${REACT_APP_REDIRECT_URI}&response_type=code`
  const handleLogin = ()=>{
      window.location.href = kakaoURL
  }

  useEffect(()=>{
    fetch("/api/v1/welcome")
      .then((response)=>{
        return response.json();
      })
      .then((data)=>{
        setMassege(data);
      });
  },[]);

  return (
    <>
      <MainDiv>
        <Mainlogo src={NOTI} />
        <h1>{message}</h1>
        <SocialWrap>
        {/* <button onClick={handleLogin}>카카오 로그인</button> */}

          <a href="/Main">
            <SocialImg style={{ margin: '1rem' }} src={GOOGLE} />
          </a>
          <a href="/Main">
          <SocialImg style={{ margin: '1rem' }} src={NAVER} />
          </a>
          <a href={kakaoURL}>
          <SocialImg style={{ margin: '1rem' }} src={KAKAO} />
          </a>
        </SocialWrap>
      </MainDiv>
    </>
  );
}

export default Login;
