import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled, { ThemeProvider } from "styled-components";
import axios from "axios";
import theme from "../styles/theme";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
  justify-content: right;
  padding-right: 40px;
  background-color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

const NavLink = styled(Link)`
  text-decoration: none;
  margin: 1.1rem;
  font-size: 17px;
  color: white;
`;

function Navigation() {
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
  const token = window.localStorage.getItem("token");

  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };

  useEffect(() => {
    async function themeSelec() {
      const userId = getUserIdFromToken();
      const response = await axios.get(`/api/v1/userInfo/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userThemeName = response.data.userColor;
      if (userThemeName && theme[userThemeName]) {
        setCurrentTheme(theme[userThemeName]); // 가져온 테마로 상태 업데이트
      }
    }
    themeSelec();
  }, [token]);

  return (
    <>
      <Nav>
        <NavLink>
          <NavLink to={"/Todo"}>일정</NavLink>
          <NavLink to={"/Todo"}>협업</NavLink>
          <NavLink to={"/Todo"}>일기</NavLink>
          <NavLink to={"/Todo"}>설정</NavLink>
        </NavLink>
      </Nav>
    </>
  );
}
export default Navigation;
