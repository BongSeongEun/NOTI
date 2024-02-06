import styled from "styled-components";

const DiaryContainer = styled.div`
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 300px;
  margin-left: 300px;

  @media (max-width: 1050px) {
    margin-left: 0;
    padding-left: 20px;
    padding-right: 20px;
  }
`;

export default DiaryContainer;
