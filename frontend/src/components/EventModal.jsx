import React from "react";
import styled from "styled-components";

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  max-width: 400px;
  width: 100%;

  // 미디어 쿼리 추가
  @media (max-width: 1050px) {
    // LeftSidebar가 사라지는 화면 너비
    margin-right: 300px; // LeftSidebar가 사라졌을 때 왼쪽 여백 제거
  }
`;

const CloseButton = styled.button`
  align-self: flex-end;
  border: none;
  background-color: white;
`;

// ModalProps 타입 정의를 추가할 수 있습니다. (여기서는 생략)
const EventModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>x</CloseButton>
        {children}
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default EventModal;
