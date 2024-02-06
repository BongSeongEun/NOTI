/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React from "react";
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

const DiaryItem = ({ diary, onClick }) => (
  // 클릭 이벤트 핸들러를 prop으로 받아와서 사용합니다.
  <DiaryItemContainer onClick={() => onClick(diary.id)}>
    <DiaryDate>{diary.date}</DiaryDate>
    <DiaryTitle>{diary.title}</DiaryTitle>
  </DiaryItemContainer>
);
export default DiaryItem;
