/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import NOTI from './asset/KakaoTalk_20240105_025742662.png';
import NAVER from './asset/NAVER.png';
import GOOGLE from './asset/GOOGLE.png';
import KAKAO from './asset/KAKAO.png';

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
function App() {
  const [message, setMassege] = useState([]);

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
          <SocialImg style={{ margin: '1rem' }} src={GOOGLE} />
          <SocialImg style={{ margin: '1rem' }} src={NAVER} />
          <SocialImg style={{ margin: '1rem' }} src={KAKAO} />
        </SocialWrap>
      </MainDiv>
    </>
  );
}

export default App;
