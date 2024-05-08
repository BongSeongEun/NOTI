// 로그인중입니다 확인하는 페이지

/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import axios from "axios";

const Redirection = () => {
  const code = new URL(window.location.toString()).searchParams.get("code");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .post(`http://15.164.151.130:4000/authreact?code=${code}`)
      .then(res => {
        const token = res.headers.authorization;
        window.localStorage.setItem("token", token);
        // 토큰이 있으면 메인 페이지로 이동, 없으면 회원가입 페이지로 이동
        if (token) {
          navigate("/Main");
        } else {
          navigate("/Register");
        }
      })
      .catch(error => {
        // 에러 발생 시 로그 출력 및 회원가입 페이지로 리다이렉트
        console.error("로그인 중 에러 발생: ", error);
        navigate("/");
      });
  }, [code, navigate]);

  return <div>로그인 중입니다.</div>;
};

export default Redirection;
