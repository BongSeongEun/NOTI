import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Login from "./pages/Login.jsx";
import Main from "./pages/Main.jsx";
import Register from "./pages/Register.jsx";
import Redirection from "./pages/Redirection.jsx";
import Welcome from "./pages/Welcome.jsx";
import Todo2 from "./pages/Todo2.jsx";
import Diary from "./pages/Diary.jsx"; // Diary 컴포넌트 import
import Coop from "./pages/Coop.jsx"; // Coop 컴포넌트 import
import Setting from "./pages/Setting.jsx"; // Setting 컴포넌트 import
import Stat from "./pages/Stat.jsx"; // Stat 컴포넌트 import
import CoopDetail from "./pages/CoopDetail.jsx";
import EditProfile from "./pages/EditProfile.jsx";
// import DiaryPage from "./pages/DiaryPage.jsx";

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
          <Route path="/Main" element={<Todo2 />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Welcome" element={<Welcome />} />
          <Route path="/Coop" element={<Coop />} />
          <Route path="/Coop/:teamId" element={<CoopDetail />} />
          <Route path="/Diary" element={<Diary />} />
          {/* <Route path="/Diary/:id" element={<DiaryPage />} /> */}
          <Route path="/Stat" element={<Stat />} />
          <Route path="/Setting" element={<Setting />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/auth" element={<Redirection />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
