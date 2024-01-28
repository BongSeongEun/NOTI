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
    axios.post(`/auth?code=${code}`).then(res => {
      navigate("/Main");
    });
  }, [code, navigate]);

  return <div>로그인 중입니다.</div>;
};

export default Redirection;
