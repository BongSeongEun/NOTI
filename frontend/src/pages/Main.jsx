// 내 일정 페이지

/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import styled from "styled-components";

const MainDiv = styled.div`
  // 메인 div
  display: flex;
  // flex-direction: column; // 세로 나열
  // align-items: center; // 가운데 놓기
  width: 100%;
  justify-content: center;
  background-color: #ffffff;
  height: 100vh;
`;
const HorizontalBox = styled.div`
  // 아이템을 가로정렬하는 상자
  display: flex; // 정렬하려면 이거 먼저 써야함
  //flex-direction: row; // 가로나열
  justify-content: center; // 가운데 정렬
  width: 100%;
  height: auto;
`;
const VerticalBox = styled.div`
  // 아이템을 세로정렬하는 상자
  display: flex; // 정렬하려면 이거 먼저 써야함
  align-items: center; // 수직 가운데 정렬
  flex-direction: column; // 세로나열
  width: 100%;
  height: auto;
`;

const header = styled.div`
  // 상단메뉴
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 80px;
  background-color: #b1c3ff;
`;

const contents = styled.div`
  display: flex;
  width: 96%;
  max-width: 1100px;
  height: 100%;
  margin: 0 outo;
  align-items: center;
  justify-content: space-between; //항목사이 동일한 간격
`;

const navigation = styled.div`
  ul {
    // ul 요소 스타일 적용
    // 자식요소들 수평나열
    display: flex;
    list-style: none;
  }
  li + li {
    // 형제 관계에있는 리스트 아이템 스타일 적용
    margin-left: 30px;
  }
`;

function Main() {
  return (
    <>
      <div>
        <header>
          <contents>로고</contents>
          <navigation>
            <ul>
              <li>메뉴1</li>
              <li>메뉴2</li>
              <li>메뉴3</li>
            </ul>
          </navigation>
        </header>
        <h1>메인입니다.</h1>
      </div>
    </>
  );
}

export default Main;
