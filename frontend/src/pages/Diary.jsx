import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";
import { format } from "date-fns"; // 날짜 포맷을 위한 라이브러리
import theme from "../styles/theme"; // 테마 파일 불러오기
import DiaryList from "../components/DiaryList"; // 다른 파일에서 DiaryItem 컴포넌트를 import할 때
import NavBar from "../components/Navigation";
import DiaryEntry from "../components/DiaryEntry"; // 일기 항목 컴포넌트
import DiaryCalendar from "../components/DiaryCalendar";

const MainDiv = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 350px;
  margin-left: 350px;

  // 스크롤바 숨기기
  ::-webkit-scrollbar {
    display: none; // 웹킷 브라우저(크롬, 사파리 등)에서 스크롤바 숨김
  }
  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
  }
  padding-top: 140px;
`;
const DateHeader = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  height: 40px;
  width: 100%;
  color: black;
  border-bottom: 2px solid
    ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

const DiaryContent = styled.div`
  width: 95%;
  padding-top: 20px;
  padding-left: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  margin-left: 20px;
`;

const DiaryWrap = styled.div`
  display: flex;
`;
const DiaryListWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 20px;
`;
const DiaryCalenderWrap = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

function Diary() {
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수
  const token = window.localStorage.getItem("token"); // 토큰 추가
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [diary, setDiary] = useState(null);
  const [isEditingGlobal, setIsEditingGlobal] = useState(false);

  // jwt토큰을 디코딩해서 userid를 가져오는 코드
  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    return decodedJSON.id.toString();
  };

  useEffect(() => {
    async function fetchUserData() {
      const userId = getUserIdFromToken(); // 사용자 ID 가져오기
      try {
        const response = await axios.get(
          `http://15.164.151.130:4000/api/v1/userInfo/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        // 사용자의 테마 정보와 이미지 데이터를 서버로부터 받아옴
        const userThemeName = response.data.userColor; // 사용자의 테마 이름

        // 사용자의 테마를 상태에 적용
        if (theme[userThemeName]) {
          setCurrentTheme(theme[userThemeName]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }

    fetchUserData();
  }, [token]);

  const fetchDiary = async (userId, diaryDate) => {
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v2/diaryDate/${userId}/${diaryDate}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDiary(response.data);
    } catch (error) {
      console.error("Error fetching diary:", error);
      setDiary(null); // 오류 발생 시 일기 초기화
    }
  };

  const saveDiary = async updatedDiary => {
    const { diaryId, ...data } = updatedDiary;
    const userId = getUserIdFromToken();
    try {
      await axios.put(
        `http://15.164.151.130:4000/api/v2/diaryUpdate/${userId}/${diaryId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      fetchDiary(userId, format(selectedDate, "yyyy.MM.dd")); // 저장 후 일기 다시 로드
    } catch (error) {
      console.error("Error saving diary:", error);
    }
  };

  const deleteDiary = async diaryId => {
    const userId = getUserIdFromToken();
    try {
      await axios.delete(
        `http://15.164.151.130:4000/api/v2/diaryDelete/${userId}/${diaryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDiary(null); // 삭제 후 일기 초기화
    } catch (error) {
      console.error("Error deleting diary:", error);
    }
  };

  useEffect(() => {
    const userId = getUserIdFromToken();
    const formattedDate = format(selectedDate, "yyyy.MM.dd");
    fetchDiary(userId, formattedDate);
  }, [selectedDate]);

  const setDate = date => {
    setSelectedDate(date);
  };
  const userId = getUserIdFromToken();

  return (
    <ThemeProvider theme={currentTheme}>
      <NavBar setDate={setDate} />

      <MainDiv>
        <DateHeader>노티의 하루 루틴 분석</DateHeader>
        <DiaryContent>
          {diary ? (
            <DiaryEntry
              diary={diary}
              onSave={saveDiary}
              onDelete={deleteDiary}
              onRefresh={() =>
                fetchDiary(
                  getUserIdFromToken(),
                  format(selectedDate, "yyyy.MM.dd"),
                )
              }
              isEditingGlobal={isEditingGlobal}
              setIsEditingGlobal={setIsEditingGlobal}
            />
          ) : (
            <p>선택한 날짜에 일기가 없습니다.</p>
          )}
        </DiaryContent>
        <DiaryWrap>
          <DiaryCalenderWrap>
            <DiaryCalendar userId={userId} />
          </DiaryCalenderWrap>
          <DiaryListWrap>
            <DiaryList
              onSave={saveDiary}
              onDelete={deleteDiary}
              onRefresh={() =>
                fetchDiary(
                  getUserIdFromToken(),
                  format(selectedDate, "yyyy.MM.dd"),
                )
              }
              isEditingGlobal={isEditingGlobal}
            />
          </DiaryListWrap>
        </DiaryWrap>
      </MainDiv>
    </ThemeProvider>
  );
}

export default Diary;
