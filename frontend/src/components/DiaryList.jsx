/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import DiaryEntry from "./DiaryEntry"; // 수정된 DiaryEntry 컴포넌트 import

const DiaryItemContainer = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  width: 80%;

  ::-webkit-scrollbar {
    display: none;
  }
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
  margin-bottom: 5px;
  font-size: 0.8em;
  color: #666;
`;

const DetailContainer = styled.div`
  width: 75%;
  height: auto;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: 20px;
`;

// DiaryList 컴포넌트 정의
const DiaryList = ({ onSave, onDelete }) => {
  // 선택된 일기의 상세 정보 상태
  const [selectedDiaryId, setSelectedDiaryId] = useState(null);
  const [diaries, setDiaries] = useState([]); // 일기 목록을 담을 상태
  const token = window.localStorage.getItem("token");

  // 토큰 가져오는 함수
  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    return decodedJSON.id.toString();
  };

  const fetchDiaries = async () => {
    const userId = getUserIdFromToken(); // 사용자 ID 가져오기
    try {
      // 실제 userId를 적절히 채워야 합니다.
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v2/diarylist/${userId}`,
      );
      // 날짜 순으로 정렬합니다. (가장 최근 날짜가 먼저 오도록)
      const sortedDiaries = response.data.sort(
        (a, b) => new Date(b.diaryDate) - new Date(a.diaryDate),
      );
      setDiaries(sortedDiaries); // 받아온 데이터를 상태에 저장합니다.
    } catch (error) {
      console.error("일기 목록을 불러오는데 실패했습니다.", error);
    }
  };
  useEffect(() => {
    fetchDiaries();
  }); // 컴포넌트가 마운트될 때 한 번만 실행합니다.

  const handleDiaryClick = async diaryId => {
    // 이미 선택된 일기를 클릭하면 상세 내용을 숨깁니다.
    if (selectedDiaryId === diaryId) {
      setSelectedDiaryId(null);
    } else {
      setSelectedDiaryId(diaryId);
    }
  };

  return (
    <>
      {diaries.map(diary => (
        <React.Fragment key={diary.diaryId}>
          <DiaryItemContainer onClick={() => handleDiaryClick(diary.diaryId)}>
            <DiaryDate>{diary.diaryDate}</DiaryDate>
            <DiaryTitle>{diary.diaryTitle}</DiaryTitle>
          </DiaryItemContainer>
          {selectedDiaryId === diary.diaryId && (
            <DetailContainer>
              <DiaryEntry diary={diary} onSave={onSave} onDelete={onDelete} />
            </DetailContainer>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default DiaryList;
