import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/Navigation";
import theme from "../styles/theme";

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
  padding-top: 140px;
  justify-content: center;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Button = styled.button`
  background-color: ${props => props.theme.color1};
  color: white;
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: ${props => props.theme.color2};
  }
`;

function Setting() {
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
  const [selectedDate, setSelectedDate] = useState("");

  const setDate = date => {
    setSelectedDate(date);
  };

  const handleLogout = () => {
    window.localStorage.removeItem("token");
    navigate("/");
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <NavBar setDate={setDate} />
      <div>
        <MainDiv>
          설정
          <ButtonContainer>
            <Button onClick={handleLogout}>로그아웃</Button>
            <Button onClick={handleEditProfile}>회원정보 수정</Button>
          </ButtonContainer>
        </MainDiv>
      </div>
    </ThemeProvider>
  );
}

export default Setting;
