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

export default Redirection;