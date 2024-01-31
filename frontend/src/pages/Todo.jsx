import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { useDropzone, open } from "react-dropzone";
import {
  Navigate,
  useNavigate,
  Link,
  Toggle,
  redirect,
} from "react-router-dom";
import { backgrounds, lighten } from "polished";
import theme from "../styles/theme"; // 테마 파일 불러오기

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
`;

const CloseButton = styled.button`
  align-self: flex-end;
`;

const DiaryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 30%;
  padding-right: 30%;
`;

const DateHeader = styled.div`
  font-size: 24px;
  margin-bottom: 20px;
  border-bottom: 2px solid
    ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

const EventList = styled.div`
  width: 100%;
`;

const EventItem = styled.div`
  background: ${props => props.theme.color2 || theme.OrangeTheme.color2};
  color: white;
  padding: 10px 20px;
  border-radius: 20px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AddEventButton = styled.button`
  background: grey;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  margin-top: 20px;
`;

const InputField = styled.input`
  width: 94%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 10px;
  border: none;
  background-color: #f2f3f5;
`;

const TimeInput = styled(InputField).attrs({ type: "time" })``;

const ColorSelector = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 10px 0;
`;

const ColorOption = styled.div`
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: ${props => props.color};
  cursor: pointer;
`;

const SubmitButton = styled.button`
  background-color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
`;

const SubTextBox = styled.div`
  // 소제목 textBox
  letter-spacing: 1px;
  color: #000000;
  width: 100%;
  height: 0 auto;
  text-align: left;
  margin-left: 3px;
  font-weight: bold;
`;

function Todo({ selectedDate }) {
  const navigate = useNavigate();
  const formatDate = date => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); // 월은 0부터 시작하므로 1을 더함
    const day = `0${d.getDate()}`.slice(-2);
    return `${year}.${month}.${day}`;
  };
  // 모달창 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 새 일정의 제목, 시간, 색상 상태
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedColor, setSelectedColor] = useState(theme.OrangeTheme.color1);

  // 색상 선택기에서 색상을 선택하는 함수
  const handleColorSelect = color => {
    setSelectedColor(color);
  };

  // 모달을 여는 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };
  // 새 일정을 추가하는 함수 (추후 구현 필요)
  const addNewEvent = () => {
    console.log("Adding new event", {
      title,
      startTime,
      endTime,
      selectedColor,
    });
    // 여기서 일정 추가 로직을 구현합니다.
    // 예: 서버에 일정 정보를 보내거나, 상태에 일정을 추가합니다.
    closeModal(); // 모달 닫기
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <DiaryContainer>
          <DateHeader>{formatDate(selectedDate)}</DateHeader>
          <EventList>
            {/* 이 부분에서 날짜에 해당하는 일정들을 렌더링합니다.
            실제 애플리케이션에서는 서버로부터 받아온 데이터를 사용하게 됩니다. */}
            <EventItem style={{ backgroundColor: theme.OrangeTheme.color1 }}>
              운동 오전
            </EventItem>
            <EventItem style={{ backgroundColor: theme.OrangeTheme.color2 }}>
              장보기 점심
            </EventItem>
            <EventItem style={{ backgroundColor: theme.OrangeTheme.color3 }}>
              스터디
            </EventItem>
          </EventList>
          <AddEventButton onClick={openModal}>
            + 새 일정 만들기
            {isModalOpen && (
              <ModalBackdrop onClick={closeModal}>
                <ModalContainer onClick={e => e.stopPropagation()}>
                  <CloseButton
                    onClick={closeModal}
                    style={{ border: "none", backgroundColor: "white" }}
                  >
                    x
                  </CloseButton>
                  <SubTextBox>일정 제목</SubTextBox>
                  <InputField
                    placeholder="노티이름을 작성해주세요!"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={15}
                    style={{ marginBottom: "30px" }}
                  />
                  <SubTextBox>일정 시작</SubTextBox>
                  <TimeInput
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                  />
                  <SubTextBox>일정 종료</SubTextBox>
                  <TimeInput
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    style={{ marginBottom: "30px" }}
                  />
                  <SubTextBox>노티 색상</SubTextBox>
                  <ColorSelector style={{ marginBottom: "30px" }}>
                    {Object.values(theme.OrangeTheme).map((color, index) => (
                      <ColorOption
                        key={index}
                        color={color}
                        onClick={() => handleColorSelect(color)}
                      />
                    ))}
                  </ColorSelector>
                  <SubmitButton onClick={addNewEvent}>일정 추가</SubmitButton>
                </ModalContainer>
              </ModalBackdrop>
            )}
          </AddEventButton>
        </DiaryContainer>
      </div>
    </ThemeProvider>
  );
}
export default Todo;
