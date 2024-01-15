import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Login from "./pages/Login.jsx";
import Main from "./pages/Main.jsx";
import Register from "./pages/Register.jsx";
import Redirection from "./pages/Redirection.jsx";
import Welcome from "./pages/Welcome.jsx";

const MainDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  justify-content: center;
  background-color: #f9f9f9;
  height: 100vh;
  display: flex;
`;

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/Main" element={<Main />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Welcom" element={<Welcome />} />
          <Route path="/auth" element={<Redirection />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
