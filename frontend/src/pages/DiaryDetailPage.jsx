import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "axios"; // 서버 통신을 위해 axios를 import합니다.

const DetailContainer = styled.div`
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #333;
`;

const Content = styled.p`
  color: #666;
`;

const DiaryDetailPage = () => {
  const { id } = useParams(); // URL에서 일기 ID를 추출
  const [diary, setDiary] = useState(null); // 일기 정보를 담을 상태

  // useEffect(() => {
  //   // 서버로부터 일기 세부 정보를 불러오는 함수
  //   const fetchDiaryDetail = async () => {
  //     try {
  //       // 아래 URL은 예시이며, 실제 API 엔드포인트에 맞게 수정해야 합니다.
  //       const response = await axios.get(`/api/diaries/${id}`);
  //       setDiary(response.data); // 불러온 데이터로 상태 업데이트
  //     } catch (error) {
  //       console.error("Error fetching diary detail:", error);
  //       // 에러 처리
  //     }
  //   };

  //   fetchDiaryDetail();
  // }, [id]); // id 값이 변경될 때마다 함수를 다시 실행

  // // 일기 데이터가 없을 때 로딩 표시 또는 에러 표시 등을 할 수 있습니다.
  // if (!diary) {
  //   return <div>Loading...</div>;
  // }

  return (
    <DetailContainer>
      <Title>일기 상세 보기</Title>
      <Content>제목 :</Content>
      <Content>내용 :</Content>
      {/* <Content>제목: {diary.title}</Content>
      <Content>내용: {diary.content}</Content> */}
    </DetailContainer>
  );
};

export default DiaryDetailPage;
