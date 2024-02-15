/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const DiaryItemContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  width: 80%;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const DiaryTitle = styled.h3`
  margin: 0;
  color: #333;
`;

const DiaryDate = styled.div`
  margin-top: 5px;
  font-size: 0.8em;
  color: #666;
`;

// DiaryList 컴포넌트 정의
const DiaryList = () => {
  const navigate = useNavigate();
  const [diaries, setDiaries] = useState([]); // 일기 목록을 담을 상태

  useEffect(() => {
    // 서버에서 일기 목록을 가져오는 함수
    const fetchDiaries = async () => {
      try {
        const response = await axios.get("/api/v2/diarylist/{userId}"); // 실제 userId를 적절히 채워야 합니다.
        setDiaries(response.data); // 받아온 데이터를 상태에 저장합니다.
      } catch (error) {
        console.error("일기 목록을 불러오는데 실패했습니다.", error);
      }
    };

    fetchDiaries();
  }, []); // 컴포넌트가 마운트될 때 한 번만 실행합니다.

  // 일기 항목 클릭 시의 이벤트 핸들러
  const handleClick = diaryId => {
    navigate(`/diary/${diaryId}`); // 해당 일기 상세 페이지로 이동합니다.
  };

  // 서버로부터 받은 일기 목록을 바탕으로 DiaryItem 컴포넌트를 생성합니다.
  return diaries.map(diary => (
    <DiaryItemContainer
      key={diary.diaryId}
      onClick={() => handleClick(diary.diaryId)}
    >
      <DiaryDate>{diary.diaryDate}</DiaryDate>
      <DiaryTitle>{diary.diaryTitle}</DiaryTitle>
    </DiaryItemContainer>
  ));
};

export default DiaryList;
