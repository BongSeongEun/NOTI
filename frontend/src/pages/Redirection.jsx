/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from "axios";

const Redirection = () => {
  const code = new URL(window.location.toString()).searchParams.get('code');
  const navigate = useNavigate();

  useEffect(() => {
    axios.post(`/auth?code=${code}`)
    .then((res) => {
      console.log(res);
      navigate('/Main');
    });
  },[]);

  return <div>로그인 중입니다.</div>;
};

// const Redirection = () => {
//   useEffect(() => {
//     const params= new URL(document.location.toString()).searchParams;
//     const code = params.get('code');
//     const grantType = "authorization_code";
//     const REACT_APP_REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY
//     const REACT_APP_REDIRECT_URI = process.env.REACT_APP_KAKAO_REDIRECT_URI;

//     axios.post(`https://kauth.kakao.com/oauth/authorize?client_id=${REACT_APP_REST_API_KEY}&redirect_uri=${REACT_APP_REDIRECT_URI}&response_type=code`,
//       {},
//       {  headers: { "Content-type": "application/x-www-form-urlencoded;charset=utf-8" } }
//     )
//     .then((res) => {
//       console.log(res);
//       const { access_token } = res.data;
//       axios.post(
//           `http://localhost:3000/api/v1/KakaoLogin?code=${code}`,
//           {},
//           {
//             headers: {
//                 Authorization: `Bearer ${access_token}`,
//                 "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
//             }
//           }
//       )
//       .then((res) => {
//           console.log('2번쨰', res);
//       })
//     })
//   }, [])

//   return(
//     <>
//     </>
//   )
// }

export default Redirection;