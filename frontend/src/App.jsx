/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import styled from "styled-components";
import Login from "./pages/Login";
import Main from "./pages/Main";
import Redirection from "./pages/Redirection";

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

function App() {
   return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/Main' element={<Main/>} />

          <Route exact path='/auth' element={<Redirection />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
