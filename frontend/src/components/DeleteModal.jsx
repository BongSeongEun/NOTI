// ConfirmDeleteModal.jsx
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
  z-index: 10;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Button = styled.button`
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
        <p>정말 삭제하시겠습니까?</p>
        <div>
          <Button onClick={onConfirm}>확인</Button>
          <Button onClick={onClose}>취소</Button>
        </div>
      </ModalContainer>
    </ModalBackdrop>
  );
};

export default DeleteModal;
