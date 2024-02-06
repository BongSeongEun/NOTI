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
import DiaryItem from "../pages/DiaryItem"; // 다른 파일에서 DiaryItem 컴포넌트를 import할 때
import DiaryDetailPage from "../pages/DiaryDetailPage";

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
  const [diaries, setDiaries] = useState(dummyDiaries); // 초기값을 dummyDiaries로 설정
  const [selectedDiaryId, setSelectedDiaryId] = useState(null); // 선택된 일기 ID 상태

  // 일기 항목 클릭 이벤트 핸들러
  const handleDiaryClick = id => {
    setSelectedDiaryId(id); // 클릭된 일기 ID로 상태 업데이트
  };

  // 선택된 일기의 세부 정보를 표시하는 함수
  const renderDiaryDetail = () => {
    // selectedDiaryId가 있을 때만 DiaryDetailPage 컴포넌트를 렌더링
    if (selectedDiaryId) {
      const selectedDiary = diaries.find(diary => diary.id === selectedDiaryId);
      return <DiaryDetailPage diary={selectedDiary} />;
    }
    // 선택된 일기가 없다면 null 반환
    return null;
  };

  return (
    <ThemeProvider theme={theme}>
      <MainDiv>
        <h1>일기 목록</h1>
        {diaries.map(diary => (
          <DiaryItem
            key={diary.id}
            diary={diary}
            onClick={() => handleDiaryClick(diary.id)} // 클릭 이벤트 핸들러 추가
          />
        ))}
        {renderDiaryDetail()} {/* 선택된 일기의 세부 정보 렌더링 */}
      </MainDiv>
    </ThemeProvider>
  );
}

export default Diary;
