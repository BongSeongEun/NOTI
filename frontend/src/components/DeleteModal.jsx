// ConfirmDeleteModal.jsx
import React from "react";
import styled from "styled-components";

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  align-items: center; // 가운데 놓기
  flex-direction: column;
  gap: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center; // 버튼을 가운데 정렬
  gap: 10px; // 버튼 사이의 간격
`;

const Button = styled.button`
  width: 100px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
`;

const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <p style={{ color: "black" }}>정말 삭제하시겠습니까?</p>
        <ButtonContainer>
          <Button onClick={onConfirm}>예</Button>
          <Button onClick={onClose}>아니오</Button>
        </ButtonContainer>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default DeleteModal;
