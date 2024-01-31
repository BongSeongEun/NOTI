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
import editIcon from "../asset/edit.png"; // 수정하기

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
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 30%;
  padding-right: 30%;
`;

const EventList = styled.div`
  width: 100%;
`;

const EventItem = styled.div`
  background: ${props => props.theme.color2 || theme.OrangeTheme.color2};
  color: white;
  padding: 10px;
  border-radius: 20px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: ${props => (props.completed ? "0.5" : "1")};
`;

const EventTitle = styled.div`
  flex: 1; // 사용 가능한 공간 모두 사용
  padding-right: 10px; // 시간과 간격을 주기 위해
`;

const EditButton = styled.img`
  cursor: pointer;
  margin-left: 10px; // 시간과 아이콘 사이의 간격
  width: 20px;
  height: 20px;
`;

const EventTime = styled.div`
  white-space: nowrap; // 시작 시간과 종료 시간을 같은 줄에 표시
`;

const CompleteButton = styled.div`
  margin-right: 10px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const CheckMark = styled.div`
  color: black;
  display: ${props => (props.show ? "block" : "none")};
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
  background-color: ${props => props.color || theme.OrangeTheme};
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

const DateHeader = styled.div`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  height: 40px;
  width: 100%;
  color: black;
  border-bottom: 2px solid
    ${props => props.theme.color1 || theme.OrangeTheme.color1};
`;

const Edit = styled.img`
  //토끼로고
  width: 20px;
  height: 20px;
`;

function Todo({ selectedDate }) {
  // 내 일정 목록을 관리하기 위한 상태
  const [events, setEvents] = useState([]);
  const [eventCompleted, setEventCompleted] = useState({});

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

  const handleEditClick = eventId => {
    // 수정 버튼 클릭 처리, 모달이나 폼을 열어서 이벤트를 수정할 수 있게 함
    console.log(`ID가 ${eventId}인 이벤트 수정`);
    // 실제 수정 로직을 이곳에 구현해야 함
  };

  // 일정 상태
  const toggleComplete = index => {
    const newEventCompleted = {
      ...eventCompleted,
      [index]: !eventCompleted[index],
    };
    setEventCompleted(newEventCompleted);
  };

  // 새 일정을 추가하는 함수 (event 상태를 업데이트 함)
  const addNewEvent = () => {
    const newEvent = {
      id: Math.random(), // 간단한 예시로 id 생성, 실제 애플리케이션에서는 더 견고한 방법 사용
      title,
      startTime,
      endTime,
      selectedColor,
      date: formatDate(selectedDate),
      isCompleted: false, // 완료 상태
    };
    // 여기에서 상태 업데이트 또는 서버로 전송 로직 구현
    setEvents(currentEvents => [...currentEvents, newEvent]);
    closeModal();
  };

  // 일정을 수정하고 완료 상태를 변경하기 위한 함수를 추가
  const completeEvent = id => {
    setEvents(currentEvents =>
      currentEvents.map(event =>
        event.id === id ? { ...event, isCompleted: !event.isCompleted } : event,
      ),
    );
  };

  const editEvent = id => {
    // id를 기반으로 해당 이벤트 데이터를 찾아서 모달 창에 데이터를 채우고 열기
    // 이 부분은 상세 구현에 따라 달라질 수 있습니다.
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <DiaryContainer>
          <DateHeader>{formatDate(selectedDate)}</DateHeader>
          <EventList>
            {/* 이 부분에서 날짜에 해당하는 일정들을 렌더링합니다.
            EventList 컴포넌트 내에서 events 상태를 기반으로 일정 항목을 동적으로 렌더링 */}
            {events.map((event, index) => (
              <EventItem
                key={index}
                completed={eventCompleted[index]}
                style={{ backgroundColor: event.selectedColor }}
              >
                <CompleteButton onClick={() => toggleComplete(index)}>
                  <CheckMark show={eventCompleted[index]}>✔</CheckMark>
                </CompleteButton>
                <EventTitle>{event.title}</EventTitle>
                <EventTime>
                  {event.startTime} ~ {event.endTime}
                </EventTime>
                <EditButton
                  src={editIcon}
                  alt="수정"
                  onClick={() => handleEditClick(event.id)}
                />
              </EventItem>
            ))}
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
                  <DateHeader
                    style={{
                      borderBottom: `2px solid ${selectedColor}`,
                      fontSize: "20px",
                      height: "30px",
                    }}
                  >
                    {formatDate(selectedDate)}
                  </DateHeader>
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
                  <SubmitButton color={selectedColor} onClick={addNewEvent}>
                    일정 추가
                  </SubmitButton>
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
