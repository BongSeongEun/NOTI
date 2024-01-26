/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from "styled-components";

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

function Main() {
   return (
    <>
        <MainDiv>
            <h1>메인입니다.</h1>
        </MainDiv>
    </>
  );
}

export default Main;
