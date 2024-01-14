/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from "axios";

const Redirection = (props) => {
    
    const navigate = useNavigate();
    const code = new URL(window.location.href).searchParams.get("code");

    useEffect(() => {
      const kakaoLogin = async () => {
        await axios({
          method: "GET",
          url: `http://localhost:3000/auth?code=${code}`,
          headers: {
            "Content-Type": "application/json;charset=utf-8", //json형태로 데이터를 보내겠다는뜻
            "Access-Control-Allow-Origin": "*", //이건 cors 에러때문에 넣어둔것. 당신의 프로젝트에 맞게 지워도됨
          },
        }).then((res) => {
          console.log(res);
          localStorage.setItem("name", res.data.account.kakaoName);
          navigate("/Register");
        });
    };
    kakaoLogin();
  }, [code, navigate, props.history]);

    return <div>로그인 중입니다.</div>;
  };
  
  export default Redirection;