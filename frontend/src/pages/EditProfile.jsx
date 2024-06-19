import React, { useState, useEffect } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { lighten } from "polished";
import theme from "../styles/theme";
import NavBar from "../components/Navigation";
import USER from "../asset/userimage.png";
import CAM from "../asset/cam.png";

const MainDiv = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 350px;
  margin-left: 350px;
  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
  }
  padding-top: 160px;
  justify-content: center;
`;

const RegBox = styled.div`
  border: none;
  width: 600px;
  height: auto;
  padding: 30px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
`;

const MainTextBox = styled.div`
  letter-spacing: 1px;
  color: #000000;
  text-align: left;
  font-size: 30px;
  width: 100%;
  height: 30px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const HorizontalBox = styled.div`
  margin-top: 30px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  width: 100%;
  height: auto;
`;

const VerticalBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
`;

const Label = styled.div`
  letter-spacing: 1px;
  color: #000000;
  width: 300px;
  height: 30px;
  line-height: 30px;
`;

const InputBox = styled.input`
  border: none;
  border-radius: 30px;
  background-color: #e3e4e6;
  color: #505050;
  font-size: 14px;
  text-align: left;
  padding-left: 10px;
  width: calc(100% - 300px);
  height: 30px;
  margin-left: 10px;
`;

const InputBox2 = styled.input`
  border: none;
  border-radius: 30px;
  background-color: #f2f3f5;
  color: #000000;
  font-size: 14px;
  text-align: left;
  padding-left: 10px;
  width: calc(100% - 300px);
  height: 30px;
  margin-left: 10px;
`;

const RegBtn = styled.button`
  border: none;
  width: 30%;
  height: 40px;
  border-radius: 30px;
  background-color: ${props => props.theme.color1};
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${props => lighten(0.1, props.theme.color1)};
  }
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  text-align: center;
  position: absolute;
  right: 30px;
  bottom: -20px;
`;

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
  background-color: ${props => props.theme.color1};
  color: #fff;
  &:hover {
    background-color: ${props => lighten(0.1, props.theme.color1)};
  }
`;

const ImageUpload = ({ onFileChange, imageUrl }) => {
  const [uploadedImage, setUploadedImage] = useState(imageUrl || USER);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        onFileChange(reader.result);
      };
      reader.readAsDataURL(file);
    },
  });

  useEffect(() => {
    if (imageUrl) {
      setUploadedImage(imageUrl);
    }
  }, [imageUrl]);

  return (
    <div style={{ position: "relative", display: "flex", alignItems: "left" }}>
      <div {...getRootProps()} style={{ display: "inline-block" }}>
        <input {...getInputProps()} />
        <img
          src={uploadedImage}
          alt="Uploaded"
          style={{
            border: "3px solid #e3e4e6",
            height: "80px",
            width: "80px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
      </div>
      <img
        src={CAM}
        alt="Camera"
        style={{
          position: "absolute",
          top: "55px",
          left: "55px",
          height: "20px",
          width: "20px",
        }}
      />
    </div>
  );
};

function EditProfile() {
  const navigate = useNavigate();
  const [userNickname, setUserNickname] = useState("");
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
  const [diaryTime, setDiaryTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [muteStartTime, setMuteStartTime] = useState("");
  const [muteEndTime, setMuteEndTime] = useState("");
  const token = window.localStorage.getItem("token");
  const [themeName, setThemeName] = useState("OrangeTheme");
  const [userEmail, setUserEmail] = useState("");
  const [base64Image, setBase64Image] = useState("");

  const handleThemeChange = selectedThemeName => {
    const newTheme = theme[selectedThemeName];
    if (newTheme) {
      setCurrentTheme(newTheme);
      setThemeName(selectedThemeName);
    } else {
      console.error("Selected theme does not exist:", selectedThemeName);
    }
  };

  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);
    return decodedJSON.id.toString();
  };

  const handleFileChange = base64 => {
    setBase64Image(base64);
  };

  async function postUser() {
    const userId = getUserIdFromToken();
    try {
      const response = await axios.put(
        `http://15.164.151.130:4000/api/v1/user/${userId}`,
        {
          userNickname,
          userColor: themeName,
          diaryTime,
          muteStartTime,
          muteEndTime,
          userProfile: base64Image,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.status === 200 || response.status === 201) {
        localStorage.setItem("userTheme", themeName);
        navigate("/Setting");
      }
    } catch (error) {
      console.error("Error posting user data:", error);
    }
  }

  const handleSubmit = async e => {
    e.preventDefault();
    await postUser();
    localStorage.setItem("userColor", currentTheme.color1);
  };

  async function fetchUserInfo() {
    const userId = getUserIdFromToken();
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v1/userInfo/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (response.status === 200) {
        const {
          kakaoEmail,
          userNickname: fetchedUserNickname,
          diaryTime: fetchedDiaryTime,
          muteStartTime: fetchedMuteStartTime,
          muteEndTime: fetchedMuteEndTime,
          userColor,
          userProfile,
        } = response.data;
        setUserEmail(kakaoEmail);
        setUserNickname(fetchedUserNickname);
        setDiaryTime(fetchedDiaryTime);
        setMuteStartTime(fetchedMuteStartTime);
        setMuteEndTime(fetchedMuteEndTime);
        setCurrentTheme(theme[userColor]);
        setThemeName(userColor);
        if (userProfile) {
          setBase64Image(userProfile);
        }
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  const setDate = date => {
    setSelectedDate(date);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      <NavBar setDate={setDate} />
      <MainDiv>
        <RegBox>
          <MainTextBox>회원 정보 수정</MainTextBox>
          <HorizontalBox>
            <Label>프로필 사진</Label>
            <ImageUpload
              onFileChange={handleFileChange}
              imageUrl={base64Image}
            />
          </HorizontalBox>
          <HorizontalBox>
            <Label>사용자명</Label>
            <InputBox2
              id="user_name"
              type="text"
              placeholder="닉네임 입력(6~20자)"
              value={userNickname}
              onChange={e => setUserNickname(e.target.value)}
            />
          </HorizontalBox>
          <HorizontalBox>
            <Label>이메일</Label>
            <InputBox id="user_email" type="text" readOnly value={userEmail} />
          </HorizontalBox>
          <HorizontalBox>
            <Label>방해금지 시간 설정</Label>
            <InputBox2
              id="mute_start"
              type="time"
              value={muteStartTime}
              onChange={e => setMuteStartTime(e.target.value)}
              style={{ width: "133px", marginRight: "10px" }}
            />
            ~
            <InputBox2
              id="mute_finish"
              type="time"
              value={muteEndTime}
              onChange={e => setMuteEndTime(e.target.value)}
              style={{ width: "133px", marginLeft: "10px" }}
            />
          </HorizontalBox>
          <HorizontalBox>
            <Label>일기 생성 시간 설정</Label>
            <InputBox2
              id="diary_create"
              type="time"
              value={diaryTime}
              onChange={e => setDiaryTime(e.target.value)}
            />
          </HorizontalBox>
          <HorizontalBox>
            <Label>테마 선택</Label>
            <div>
              <ThemedButton
                style={{ backgroundColor: theme.OrangeTheme.color1 }}
                onClick={() => handleThemeChange("OrangeTheme")}
              />
              <ThemedButton
                style={{ backgroundColor: theme.RedTheme.color1 }}
                onClick={() => handleThemeChange("RedTheme")}
              />
              <ThemedButton
                style={{ backgroundColor: theme.PinkTheme.color1 }}
                onClick={() => handleThemeChange("PinkTheme")}
              />
              <ThemedButton
                style={{ backgroundColor: theme.GreenTheme.color1 }}
                onClick={() => handleThemeChange("GreenTheme")}
              />
              <ThemedButton
                style={{ backgroundColor: theme.BlueTheme.color1 }}
                onClick={() => handleThemeChange("BlueTheme")}
              />
            </div>
          </HorizontalBox>
          <RegBtn onClick={handleSubmit}>완료</RegBtn>
        </RegBox>
      </MainDiv>
    </ThemeProvider>
  );
}

export default EditProfile;
