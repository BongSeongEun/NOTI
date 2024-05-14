// 설정 페이지
import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDropzone, open } from "react-dropzone";
import {
  Navigate,
  useNavigate,
  Link,
  Toggle,
  redirect,
} from "react-router-dom";
import { backgrounds, lighten } from "polished";
import NavBar from "../components/Navigation";
import SettingIcon from "../asset/setting.png"; // 수정하기
import theme from "../styles/theme"; // 테마 파일 불러오기

const MainDiv = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 350px;
  margin-left: 350px;
  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
  }
  padding-top: 140px;
  justify-content: center;
`;

function Setting() {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수
  const [selectedDate, setSelectedDate] = useState("");

  const setDate = date => {
    setSelectedDate(date);
  };
  return (
    <ThemeProvider theme={currentTheme}>
      <NavBar setDate={setDate} />
      <div>
        <MainDiv>회원정보수정</MainDiv>
      </div>
    </ThemeProvider>
  );
}
export default Setting;
