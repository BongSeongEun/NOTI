// 일기/달력 페이지
import React, { useState, useEffect } from "react";
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
import DiaryList from "./DiaryList"; // 다른 파일에서 DiaryItem 컴포넌트를 import할 때
import DiaryPage from "../pages/DiaryPage";

const MainDiv = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 300px;
  margin-left: 300px;
  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
  }
`;

// 일기 목록을 위한 더미 데이터
const dummyDiaries = [
  { id: 1, title: "오늘의 일기 1", content: "내용 1", date: "2024-02-06" },
  { id: 2, title: "오늘의 일기 2", content: "내용 2", date: "2024-02-07" },
  // 추가 일기 항목들...
];

function Diary() {
  const [diaries, setDiaries] = useState(dummyDiaries);
  const [selectedDiaryId, setSelectedDiaryId] = useState(null);

  return (
    <ThemeProvider theme={theme}>
      <MainDiv>
        <h1>일기 목록</h1>
        {diaries.map(diary => (
          <React.Fragment key={diary.id}>
            <DiaryList
              diary={diary}
              onClick={() => setSelectedDiaryId(diary.id)} // 클릭 이벤트 핸들러
            />
            {/* 선택된 일기의 내용을 바로 아래에 렌더링 */}
            {selectedDiaryId === diary.id && <DiaryPage diary={diary} />}
          </React.Fragment>
        ))}
      </MainDiv>
    </ThemeProvider>
  );
}

export default Diary;
