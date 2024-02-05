/* eslint-disable import/no-extraneous-dependencies */
// 회원가입 페이지

/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDropzone, open } from "react-dropzone";
import base64 from "base-64";
import {
  Navigate,
  useNavigate,
  Link,
  Toggle,
  redirect,
} from "react-router-dom";
import { backgrounds, lighten } from "polished";
import axios from "axios";
import theme from "../styles/theme"; // 테마 파일 불러오기

import NOTI from "../asset/KakaoTalk_20240105_025742662.png";
import USER from "../asset/userimage.png";
import COM from "../asset/cam.png";

// 이미지 업로드
const ImageUpload = () => {
  const [uploadedImage, setUploadedImage] = useState(USER);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    },
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <img
        src={uploadedImage}
        alt="Uploaded"
        style={{
          border: "3px",
          borderColor: "red",
          marginTop: "15px",
          height: "80px",
          width: "80px",
          borderRadius: "50%",
          marginRight: "10px",
        }}
      />
    </div>
  );
};
const MainDiv = styled.div`
  //전체화면 테두리
  display: flex;
  flex-basis: auto;
  flex-direction: row; // 가로 나열
  align-items: center; // 가운데 놓기
  justify-content: center; // 가운데 놓기
  width: 100%;
  background-color: #ffffff;
  height: 100vh;
`;

const LogoDiv = styled.div`
  // 로고쪽 큰 박스
  height: 100%;
  width: 50%; // 가로 50%
  display: flex; // 전체 체우기?
  flex-direction: column; // column : 세로 (row : 가로)
  align-items: center;
  justify-content: center;
`;

const MainLogo = styled.img`
  //토끼로고
  width: 300px;
  height: 400px;
`;

const RegDiv = styled.div`
  //회원가입 제일큰 박스
  height: auto;
  width: 50%; // 가로 50%
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; // 내용 세로나열
`;

const RegBox = styled.div`
  //회원가입 회색 큰 박스
  border: 3px solid #b7babf;
  width: 350px;
  height: auto;
  padding: 30px;
  background-color: #f9f9f9;
  border-radius: 20px; //모서리 둥글게
  display: flex; // 정렬하려면 이거 먼저 써야함
  align-items: center; // 수직 가운데 정렬
  flex-direction: column; // 내용 세로나열
`;

const MainTextBox = styled.div`
  // 큰 텍스트 박스
  // border: 1px solid blue;
  letter-spacing: 1px;
  color: #000000;
  text-align: center;
  font-size: 20px;
  width: 100%;
  height: 30px;
  font-weight: normal;
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

const SubTextBox = styled.div`
  // 소제목 textBox
  letter-spacing: 1px;
  color: #000000;
  width: 100%;
  height: 30px;
`;

const InputBox = styled.input`
  // 읽기전용 input box
  border: none; // 테두리 없음
  border-radius: 30px; // 모서리 둥굴게
  background-color: #e3e4e6;
  color: #505050;
  font-size: 10px;
  text-align: center;
  width: 240px;
  height: 30px;
  margin-bottom: 2%;
`;

const InputBox2 = styled.input`
  // 사용자에게 입력받는 input box
  border: none;
  width: 180px;
  height: 30px;
  border-radius: 30px; // 모서리 둥굴게
  background-color: #f2f3f5;
  color: #000000;
  font-size: 10px;
  text-align: center;
`;

const Button2 = styled.button`
  // 중복확인
  border: none;
  height: 30px;
  width: 60px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border-radius: 3px;
  font-size: 10px;
  background-color: ${props => props.theme.color1};
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${props => lighten(0.1, props.theme.color1)};
  }
  color: #ffffff;
`;

const RegBtn = styled.button`
  // 가입하기 버튼
  border: none;
  width: 260px;
  height: 30px;
  border-radius: 40px; // 모서리 둥굴게
  background-color: ${props => props.theme.color1};
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${props => lighten(0.1, props.theme.color1)};
  }
  color: #ffffff;
  font-size: 12px; // 글씨크기
  font-weight: bold;
  letter-spacing: 1px; // 글자사이 간격
  // transition: transform 80ms ease-in; // 부드럽게 전환
  text-align: center; // 텍스트 가운데 정렬
`;

function myLighten(amount, color) {
  return lighten(amount, color);
}

const ThemedButton = styled.button`
  border: 4px solid #ffffff;
  height: 30px;
  width: 30px;
  padding: 10px;
  margin: 10px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: background-color 0.3s ease;

  /* 테마 색상에 따른 스타일 */
  background-color: ${props => props.theme.color1};
  color: #fff; // 텍스트 색상은 흰색으로 설정

  &:hover {
    background-color: ${props => lighten(0.1, props.theme.color1)};
  }
`;

function Register() {
  const navigate = useNavigate();
  const [userNickname, setUserNickname] = useState(""); // 사용자명 상태 변수
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태 변수
  const [diaryTime, setDiaryTime] = useState(""); // 일기 생성 시간 상태
  const [muteStartTime, setMuteStartTime] = useState(""); // 방해 금지 시작 시간 상태
  const [muteEndTime, setMuteEndTime] = useState(""); // 방해 금지 종료 시간 상태
  const token = window.localStorage.getItem("token");
  const [themeName, setThemeName] = useState("OrangeTheme"); // 기본 테마 이름
  const [selectedFile, setSelectedFile] = useState(null);

  // 테마 변경 핸들러
  const handleThemeChange = selectedThemeName => {
    const newTheme = theme[selectedThemeName];
    if (newTheme) {
      setCurrentTheme(newTheme); // UI 상에서 테마를 적용
      setThemeName(selectedThemeName); // 선택된 테마 이름을 상태에 저장
      localStorage.setItem("userTheme", selectedThemeName); // 선택된 테마 이름을 localStorage에 저장
    } else {
      console.error("Selected theme does not exist:", selectedThemeName);
    }
  };

  // 이미지 파일 변경 처리
  const handleFileChange = file => {
    setSelectedFile(file);
  };

  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };

  // 사용자 정보 전송 함수
  async function postUser() {
    const formData = new FormData();
    const userId = getUserIdFromToken();
    if (selectedFile) {
      formData.append("userProfile", selectedFile);
    }
    try {
      await axios.put(
        `/api/v1/user/${userId}`,
        {
          userNickname,
          userColor: themeName, // 테마의 주 색상
          diaryTime, // 일기 생성 시간
          muteStartTime, // 방해 금지 시작 시간
          muteEndTime, // 방해 금지 종료 시간
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
    } catch (error) {
      console.error("Error posting user data:", error);
      // 에러 처리
    }
  }
  // 가입하기 버튼 클릭 핸들러
  const handleSubmit = async () => {
    await postUser(); // 사용자 정보 전송
    localStorage.setItem("userColor", currentTheme.color1); // 색상을 로컬 스토리지에 저장
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <div>
        <MainDiv>
          <LogoDiv>
            <MainLogo src={NOTI} alt="로고" />
            <MainTextBox style={{ fontSize: "30px" }}>
              노티와 대화하며 하루를 만들어보세요
            </MainTextBox>
          </LogoDiv>
          <RegDiv>
            <RegBox>
              <MainTextBox style={{ marginTop: "10px" }}>
                가입을 축하드려요!
              </MainTextBox>
              <MainTextBox style={{ marginBottom: "20px" }}>
                프로필을 등록해보세요
              </MainTextBox>
              <HorizontalBox>
                <ImageUpload onFileChange={handleFileChange} />
                <VerticalBox>
                  <SubTextBox style={{ marginTop: "15px" }}>
                    사용자명*
                  </SubTextBox>
                  <HorizontalBox>
                    <InputBox2
                      id="user_name"
                      type="text"
                      placeholder="닉네임 입력(6~20자)"
                      value={userNickname}
                      onChange={e => setUserNickname(e.target.value)}
                    />
                    <Button2 style={{ marginLeft: "5px" }}>중복 확인</Button2>
                  </HorizontalBox>
                </VerticalBox>
              </HorizontalBox>
              <VerticalBox>
                <SubTextBox>이메일</SubTextBox>
                <InputBox
                  id="user_email"
                  type="text"
                  readOnly
                  style={{ width: "320px" }}
                />
                <HorizontalBox>
                  <SubTextBox>방해금지 시간 설정</SubTextBox>
                </HorizontalBox>
                <InputBox2
                  id="mute_start"
                  type="time"
                  min="yyy"
                  max="zzz"
                  value={muteStartTime}
                  onChange={e => setMuteStartTime(e.target.value)}
                  style={{ width: "320px", marginBottom: "5px" }}
                />
                <InputBox2
                  id="mute_finish"
                  type="time"
                  min="yyy"
                  max="zzz"
                  value={muteEndTime}
                  onChange={e => setMuteEndTime(e.target.value)}
                  style={{ width: "320px" }}
                />
                <SubTextBox>일기 생성 시간 설정*</SubTextBox>
                <InputBox2
                  id="diary_create"
                  type="time"
                  min="yyy"
                  max="zzz"
                  value={diaryTime}
                  onChange={e => setDiaryTime(e.target.value)}
                  style={{ width: "320px", marginBottom: "5px" }}
                />
              </VerticalBox>
              <SubTextBox>테마 선택</SubTextBox>
              <HorizontalBox>
                <ThemedButton
                  style={{ backgroundColor: theme.OrangeTheme.color1 }}
                  onClick={() => handleThemeChange("OrangeTheme")}
                ></ThemedButton>
                <ThemedButton
                  style={{ backgroundColor: theme.RedTheme.color1 }}
                  onClick={() => handleThemeChange("RedTheme")}
                ></ThemedButton>
                <ThemedButton
                  style={{ backgroundColor: theme.PinkTheme.color1 }}
                  onClick={() => handleThemeChange("PinkTheme")}
                ></ThemedButton>
                <ThemedButton
                  style={{ backgroundColor: theme.GreenTheme.color1 }}
                  onClick={() => handleThemeChange("GreenTheme")}
                ></ThemedButton>
                <ThemedButton
                  style={{ backgroundColor: theme.BlueTheme.color1 }}
                  onClick={() => handleThemeChange("BlueTheme")}
                ></ThemedButton>
              </HorizontalBox>
              <Link to="/Welcome">
                <RegBtn
                  style={{ marginTop: "30px" }}
                  onClick={handleSubmit} // 가입하기 버튼에 postUser 함수 연결
                >
                  가입하기
                </RegBtn>
              </Link>
            </RegBox>
          </RegDiv>
        </MainDiv>
      </div>
    </ThemeProvider>
  );
}
export default Register;
