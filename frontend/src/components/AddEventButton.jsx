import styled from "styled-components";

const AddEventButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  white-space: nowrap;
  background: grey;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  margin-top: 20px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease,
    transform 0.3s ease;

  &:hover {
    background: #6e6e6e; /* 배경색을 약간 어둡게 변경 */
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2); /* 그림자 추가 */
    transform: translateY(-2px); /* 버튼이 약간 떠오르는 효과 */
  }
`;

export default AddEventButton;
