import styled from "styled-components";

const DiaryContainer = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 300px;
  margin-left: 300px;
  height: 100%;
  ::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
  }
  margin-bottom: 40px;
`;

export default DiaryContainer;
