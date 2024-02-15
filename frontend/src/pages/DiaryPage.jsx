// 일기내용
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "axios"; // 서버 통신을 위해 axios를 import합니다.

const DetailContainer = styled.div`
  width: 70%;
  height: auto;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 10px;
  width: 100%;
  color: #333;
`;

const Content = styled.p`
  color: #666;
`;

const DiaryPage = () => {
  const { id } = useParams(); // URL에서 일기 ID를 추출
  const [diary, setDiary] = useState(null); // 일기 정보를 담을 상태

  // 서버에서 일기 상세 정보를 가져오는 함수입니다.
  useEffect(() => {
    const fetchDiary = async () => {
      try {
        const response = await axios.get(`/api/v2/diaryDetail/${id}`);
        setDiary(response.data); // 가져온 데이터를 상태에 저장합니다.
      } catch (error) {
        console.error("일기를 불러오는데 실패했습니다.", error);
      }
    };

    fetchDiary();
  }, [id]); // id가 변경될 때마다 이 함수를 다시 실행합니다.

  // 서버에서 데이터를 아직 받아오지 않았다면 로딩 텍스트를 표시합니다.
  if (!diary) {
    return <DetailContainer>로딩 중...</DetailContainer>;
  }

  return (
    <DetailContainer>
      <Title>일기 상세 보기</Title>
      {/* 서버에서 받아온 데이터를 화면에 표시합니다. */}
      <Content>제목: {diary.diaryTitle}</Content>
      <Content>내용: {diary.diaryContent}</Content>
    </DetailContainer>
  );
};

export default DiaryPage;
