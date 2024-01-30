// 일기/달력 페이지
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
import { format } from "date-fns"; // 날짜 포맷을 위한 라이브러리
import theme from "../styles/theme"; // 테마 파일 불러오기

const MainDiv = styled.div`
  //전체화면 테두리
  display: flex;
  flex-basis: auto;
  flex-direction: column; // 세로 나열
  align-items: center; // 가운데 놓기
  justify-content: center; // 가운데 놓기
  width: 100%;
  background-color: #333;
  height: 100%;
  color: white;
`;
function Diary() {
  const navigate = useNavigate();
  return (
    <div>
      <MainDiv>일기</MainDiv>
    </div>
  );
}
export default Diary;
