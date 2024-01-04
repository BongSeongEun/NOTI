/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import styled from "styled-components";

const MainDiv = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
`;

function App() {
  const [message, setMassege] = useState([]);

  useEffect(()=>{
    fetch("/api/v1/welcome")
      .then((response)=>{
        return response.json();
      })
      .then((data)=>{
        setMassege(data);
      });
  },[]);

  return (
    <>
      <MainDiv>
        <h1>{message}</h1>
      </MainDiv>
    </>
  );
}

export default App;
