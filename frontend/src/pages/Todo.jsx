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
import TimeTable from "../pages/TimeTable"; // 타임테이블
import DiaryContainer from "../components/DiaryContainer";
import AddEventButton from "../components/AddEventButton";

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

  // 일정에 따라 색칠할 시간 블록들의 상태를 관리
  const [schedule, setSchedule] = useState(Array(24 * 6).fill(false));

  // 수정 모드 상태와 현재 수정 중인 이벤트의 ID를 저장하는 상태 추가
  const [isEditing, setIsEditing] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  // 달력에 년.월.일 나오게 하는 함수
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

  const token = window.localStorage.getItem("token");

  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };

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

  // 수정 버튼 클릭 시 처리 함수
  const handleEditClick = eventId => {
    const eventToEdit = events.find(event => event.id === eventId);
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setStartTime(eventToEdit.startTime);
      setEndTime(eventToEdit.endTime);
      setSelectedColor(eventToEdit.selectedColor);
      setEditingEventId(eventId); // 수정 중인 이벤트 ID 설정
      setIsEditing(true); // 수정 모드로 전환
      openModal(); // 모달 창 열기
    }
  };

  // 새 일정 만들기 버튼 클릭 시 처리 함수
  const openNewEventModal = () => {
    // 입력 필드 상태 초기화
    setTitle("");
    setStartTime("");
    setEndTime("");
    setSelectedColor(theme.OrangeTheme.color1); // 기본 색상으로 초기화
    setIsEditing(false); // 편집 모드가 아닌 새 추가 모드로 설정
    setEditingEventId(null); // 편집 중인 이벤트 ID 초기화
    openModal(); // 모달 창 열기
  };

  // 시간을 schedule 배열의 인덱스로 변환하는 함수
  const timeToIndex = time => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 6 + Math.floor(minutes / 10);
  };

  // 일정 상태
  const toggleComplete = index => {
    const newEventCompleted = {
      ...eventCompleted,
      [index]: !eventCompleted[index],
    };
    setEventCompleted(newEventCompleted);

    // 해당 일정의 시작과 종료 시간을 기반으로 schedule 업데이트
    const event = events[index];
    if (event) {
      const startTimeIndex = timeToIndex(event.startTime);
      const endTimeIndex = timeToIndex(event.endTime);
      const newSchedule = [...schedule];
      for (let i = startTimeIndex; i <= endTimeIndex; i += 1) {
        newSchedule[i] = newEventCompleted[index] ? event.selectedColor : false;
      }
      setSchedule(newSchedule);
    }
  };

  // 모달에서 '추가하기' 또는 '수정하기' 버튼 클릭 시 처리 함수
  const handleSubmit = () => {
    if (isEditing) {
      // 수정 로직
      setEvents(currentEvents =>
        currentEvents.map(event =>
          event.id === editingEventId
            ? { ...event, title, startTime, endTime, selectedColor }
            : event,
        ),
      );
    } else {
      // 추가 로직
      const newEvent = {
        id: Math.random(),
        title,
        startTime,
        endTime,
        selectedColor,
        date: formatDate(selectedDate),
        isCompleted: false,
      };
      setEvents(currentEvents => [...currentEvents, newEvent]);
    }
    closeModal(); // 모달 창 닫기
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
                  onClick={() =>
                    !eventCompleted[index] && handleEditClick(event.id)
                  }
                />
              </EventItem>
            ))}
          </EventList>
          <AddEventButton onClick={openNewEventModal}>
            + 새 노티 만들기
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
                  <SubTextBox>노티 제목</SubTextBox>

                  <InputField
                    placeholder="노티이름을 작성해주세요!"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={15}
                    style={{ marginBottom: "30px" }}
                  />
                  <SubTextBox>노티 시작</SubTextBox>
                  <TimeInput
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                  />
                  <SubTextBox>노티 종료</SubTextBox>
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
                  <SubmitButton color={selectedColor} onClick={handleSubmit}>
                    {isEditing ? "수정하기" : "일정 추가"}{" "}
                  </SubmitButton>
                </ModalContainer>
              </ModalBackdrop>
            )}
          </AddEventButton>
          <TimeTable schedule={schedule} />
        </DiaryContainer>
      </div>
    </ThemeProvider>
  );
}
export default Todo;
