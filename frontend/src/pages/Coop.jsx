// 협업페이지
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
import theme from "../styles/theme"; // 테마 파일 불러오기
import editIcon from "../asset/fi-rr-pencil.png"; // 가정한 경로
import deleteIcon from "../asset/fi-rr-trash.png"; // 가정한 경로

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

// Styled components
const PageContainer = styled.div`
  background: #fff;
  color: #333;
  font-family: "Arial", sans-serif;
`;

const Header = styled.div`
  border-bottom: 2px solid orange;
  padding: 10px;
  font-size: 24px;
  text-align: center;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
`;

const Tab = styled.div`
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
`;

const Circle = styled.span`
  display: inline-block;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  background-color: ${props => props.color};
  margin-right: 5px;
`;

const EventContainer = styled.div`
  padding: 10px;
`;

const Event = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;

const EventInfo = styled.div`
  flex-grow: 1;
`;

const EditButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const AddEventButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  background-color: lightblue;
  border: none;
  cursor: pointer;
`;

const MemoSection = styled.div`
  border: 2px solid red;
  margin: 10px 0;
`;

const RestTable = styled.div`
  margin: 10px 0;
`;

// Main Coop component
const Coop = () => (
  <PageContainer>
    <Header>team page name</Header>
    <TabContainer>
      <Tab>협업자 list</Tab>
    </TabContainer>
    <EventContainer>
      <Event>
        <Circle color="orange" />
        <EventInfo>
          프로젝트명 디테일
          <br />D - 9 2024. 03. 05
        </EventInfo>
        <EditButton>수정/저장</EditButton>
      </Event>
      <Event>
        <Circle color="lightblue" />
        <EventInfo>
          작업자 선택
          <br />
          15:30 - 16:00
        </EventInfo>
        <EditButton>수정/저장</EditButton>
      </Event>
      <Event>
        <Circle color="blue" />
        <EventInfo>
          스테디
          <br />
          18:30 - 20:00
        </EventInfo>
        <EditButton>수정/저장</EditButton>
      </Event>
    </EventContainer>
    <AddEventButton>일정 추가</AddEventButton>
    <MemoSection>Memo</MemoSection>
    <RestTable>REST TABLE</RestTable>
  </PageContainer>
);

export default Coop;
