import React, { useState, useEffect } from "react";
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
import axios from "axios"; // axios import 확인
import DeleteModal from "../components/DeleteModal";
import theme from "../styles/theme"; // 테마 파일 불러오기
import editIcon from "../asset/fi-rr-pencil.png"; // 수정하기
import deleteIcon from "../asset/fi-rr-trash.png"; // 삭제하기
import TimeTable from "../components/TimeTable"; // 타임테이블
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
  width: 15px;
  height: 15px;
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

const DeleteButton = styled.img`
  //삭제 버튼
  cursor: pointer;
  margin-left: 10px; // 시간과 아이콘 사이의 간격 조정
  width: 15px;
  height: 15px;
`;

function Todo({ selectedDate }) {
  // 내 일정 목록을 관리하기 위한 상태
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수

  // 일정에 따라 색칠할 시간 블록들의 상태를 관리
  const [schedule, setSchedule] = useState(Array(24 * 6).fill(false));

  // 수정 모드 상태와 현재 수정 중인 이벤트의 ID를 저장하는 상태 추가
  const [isEditing, setIsEditing] = useState(false);
  const [editingTodoId, setEditingTodoId] = useState(null);

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
  const [title, setTitle] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedColor, setSelectedColor] = useState(theme.OrangeTheme.color1);

  const token = window.localStorage.getItem("token");

  // isDeleteConfirmModalOpen은 삭제 확인 모달의 열림/닫힘 상태
  // deletingTodoId는 삭제할 일정의 ID를 저장
  const [isDeleteConfirmModalOpen, setIsDeleteConfirmModalOpen] =
    useState(false);
  const [deletingTodoId, setDeletingTodoId] = useState(null);

  // 토큰 가져오는 함수
  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };

  // 사용자 데이터 및 일정 데이터를 가져오는 함수
  const fetchUserData = async () => {
    const userId = getUserIdFromToken(); // 사용자 ID 가져오기
    const formattedDate = formatDate(selectedDate); // 선택된 날짜를 YYYY-MM-DD 형식으로 변환

    try {
      // 사용자 정보 불러오기
      const userResponse = await axios.get(`/api/v1/userInfo/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // 사용자의 테마 정보를 서버로부터 받아옴
      if (userResponse.status === 200) {
        const userThemeName = userResponse.data.userColor; // 사용자의 테마 이름

        // 사용자의 테마를 상태에 적용
        if (theme[userThemeName]) {
          setCurrentTheme(theme[userThemeName]);

          // 날짜에 맞는 일정 데이터 불러오기
          const eventsResponse = await axios.get(
            `/api/v1/getTodo/${userId}?date=${formattedDate}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          if (eventsResponse.status === 200) {
            const filteredEvents = eventsResponse.data.filter(
              event => event.todoDate === formattedDate,
            );
            const updatedEvents = filteredEvents.map(event => ({
              ...event,
              selectedColor:
                theme[userThemeName][event.todoColor] || event.todoColor,
            }));
            setEvents(updatedEvents);
          } else {
            console.error("Unexpected response:", eventsResponse);
          }
        }
      } else {
        console.error("Unexpected response:", userResponse);
      }
    } catch (error) {
      console.error("Error fetching user data and events:", error);
    }
  };

  // 색상 선택기에서 색상을 선택할 때 실행하는 함수
  const handleColorSelect = colorKey => {
    setSelectedColor(colorKey); // 색상 키워드를 상태에 저장
  };
  // 수정 모달 여는함수
  const handleDeleteClick = todoId => {
    setDeletingTodoId(todoId);
    setIsDeleteConfirmModalOpen(true);
  };
  // 수정 모달
  const closeDeleteConfirmModal = () => {
    setIsDeleteConfirmModalOpen(false);
    setDeletingTodoId(null);
  };
  // 모달을 여는 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
    setStartTime("");
    setEndTime("");
  };

  // 수정 버튼 클릭 시 처리 함수
  const handleEditClick = todoId => {
    // 일정 목록에서 특정 ID를 가진 일정을 찾습니다.
    const eventToEdit = events.find(event => event.todoId === todoId);
    if (eventToEdit) {
      // 상태 변수를 업데이트하여 모달에 현재 값을 표시합니다.
      setTitle(eventToEdit.todoTitle);
      setStartTime(eventToEdit.todoStartTime);
      setEndTime(eventToEdit.todoEndTime);
      setSelectedColor(eventToEdit.selectedColor); // 여기서 색상은 이미 변환된 상태여야 합니다.
      setEditingTodoId(eventToEdit.todoId); // 수정 중인 이벤트의 ID를 상태에 저장합니다.
      setIsEditing(true); // 수정 모드로 전환합니다.
      openModal(); // 모달 창을 엽니다.
    }
  };

  // 새 일정 만들기 버튼 클릭 시 처리 함수
  const openNewEventModal = () => {
    // 입력 필드 상태 초기
    setSelectedColor(currentTheme.color1); // 기본 색상으로 초기화
    setIsEditing(false); // 편집 모드가 아닌 새 추가 모드로 설정
    setEditingTodoId(null); // 편집 중인 이벤트 ID 초기화
    openModal(); // 모달 창 열기
  };

  // 시간을 schedule 배열의 인덱스로 변환하는 함수
  const timeToIndex = time => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 6 + Math.floor(minutes / 10);
  };

  // 일정 완료 상태를 토글하는 함수
  const toggleComplete = async (todoId, index) => {
    const userId = getUserIdFromToken(); // 사용자 ID 가져오기
    // 새로운 완료 상태 값을 정의합니다.
    const newCompletedStatus = !events[index].todoDone;

    // 서버에 일정의 완료 상태를 업데이트하는 요청을 보냅니다.
    try {
      const response = await axios.put(
        `/api/v1/updateTodo/${userId}/${todoId}`,
        {
          ...events[index], // 기존 일정 데이터를 펼침
          todoDone: newCompletedStatus, // 완료 상태만 변경
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // 올바른 토큰 사용
          },
        },
      );

      if (response.status === 200) {
        // 서버 응답이 성공적으로 왔을 때 events 상태 업데이트
        const updatedEvents = events.map((event, evtIndex) =>
          evtIndex === index
            ? { ...event, todoDone: newCompletedStatus }
            : event,
        );
        setEvents(updatedEvents);
        /** toggleComplete 함수는 todoId와 index를 인자로 받아,
         * 해당 일정의 todoDone 상태를 서버에 업데이트합니다.
         * 서버로부터 성공적인 응답을 받으면,
         * events 배열과 schedule 배열을 새로운 상태로 업데이트합니다.
         * schedule 배열은 시작 시간과 종료 시간에 해당하는 인덱스를 색칠하여
         * 시간표에 반영합니다. */
        // 일정 시간에 해당하는 schedule 배열의 칸을 색칠합니다.
        const startTimeIndex = timeToIndex(updatedEvents[index].todoStartTime);
        const endTimeIndex = timeToIndex(updatedEvents[index].todoEndTime);
        const newSchedule = schedule.map((slot, idx) => {
          if (idx >= startTimeIndex && idx < endTimeIndex) {
            return newCompletedStatus
              ? updatedEvents[index].selectedColor
              : false;
          }
          return slot;
        });

        setSchedule(newSchedule);
      } else {
        // 서버 응답이 실패한 경우, 오류를 출력합니다.
        console.error("Failed to update todo status:", response);
      }
    } catch (error) {
      // 요청 중 오류가 발생한 경우, 오류를 출력합니다.
      console.error("Error updating todo status:", error);
    }
  };

  const handleDelete = async () => {
    if (!deletingTodoId) return;
    const userId = getUserIdFromToken();
    try {
      const response = await axios.delete(
        `/api/v1/deleteTodo/${userId}/${deletingTodoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        const updatedEvents = events.filter(
          event => event.todoId !== deletingTodoId,
        );
        setEvents(updatedEvents);
        closeDeleteConfirmModal(); // 삭제 후 모달 닫기
        setIsDeleteConfirmModalOpen(false);
        setDeletingTodoId(null); // 현재 삭제 중인 todo ID 초기화
      } else {
        console.error("Failed to delete the event:", response);
      }
    } catch (error) {
      console.error("Error deleting the event:", error);
    }
  };
  // 모달에서 '추가하기' 또는 '수정하기' 버튼 클릭 시 처리 함수
  const handleSubmit = async () => {
    const userId = getUserIdFromToken(); // 사용자 ID 가져오기
    const eventData = {
      todoTitle: title,
      todoStartTime: startTime,
      todoEndTime: endTime,
      todoColor: selectedColor,
      todoDone: false, // 완료 여부는 기본적으로 false로 설정
      todoDate: formatDate(selectedDate), // formatDate 함수를 사용하여 날짜 포맷 변경
    };

    try {
      let response;
      if (isEditing) {
        // 수정하는 경우
        const url = `/api/v1/updateTodo/${userId}/${editingTodoId}`; // 수정 API 엔드포인트, todoId 포함
        response = await axios.put(url, eventData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        // 새로 추가하는 경우
        const url = `/api/v1/createTodo/${userId}`; // 생성 API 엔드포인트
        response = await axios.post(url, eventData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      if (response.status === 200 || response.status === 201) {
        closeModal(); // 모달 창 닫기
        // 요청 성공 후 로직 (예: 사용자 정보와 일정 데이터 새로고침)
        await fetchUserData(); // 서버로부터 최신 데이터를 다시 받아옵니다.
      } else {
        // 서버로부터 예상치 못한 응답을 받은 경우
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error updating/adding event:", error);
      // 에러 처리
    }
  };

  // useEffect 내부에서 사용자 정보와 일정 데이터를 불러오는 로직
  useEffect(() => {
    fetchUserData();
  }, [selectedDate]); // token이 변경될 때마다 정보를 새로 불러옴

  // events 상태가 변경될 때마다 TimeTable 컴포넌트를 업데이트하는 useEffect
  useEffect(() => {
    const newSchedule = Array(24 * 6).fill(null); // 새로운 시간표 배열을 초기화합니다.

    // 완료된 일정에 대해 시간표 배열을 업데이트합니다.
    events.forEach(event => {
      if (event.todoDone) {
        const startIdx = timeToIndex(event.todoStartTime);
        const endIdx = timeToIndex(event.todoEndTime);
        for (let i = startIdx; i < endIdx; i += 1) {
          newSchedule[i] = event.todoDone
            ? event.selectedColor
            : `${event.selectedColor}80`; // 80은 투명도를 의미
        }
      }
    });

    setSchedule(newSchedule); // schedule 상태를 업데이트합니다.
  }, [events]); // events 상태가 변경될 때마다 실행됩니다.

  const handleTitleChange = e => {
    console.log("Before setTitle:", e.target.value);
    setTitle(e.target.value);
    console.log("After setTitle, title is now:", title);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <div>
        <DiaryContainer>
          <DateHeader>{formatDate(selectedDate)}</DateHeader>
          <EventList>
            {/* 이 부분에서 날짜에 해당하는 일정들을 렌더링합니다.
            EventList 컴포넌트 내에서 events 상태를 기반으로 일정 항목을 동적으로 렌더링 */}
            {events.map((event, index) => (
              <EventItem
                key={event.todoId}
                style={{
                  backgroundColor: event.selectedColor, // 일정의 선택된 색상을 항상 사용
                  opacity: event.todoDone ? "0.5" : "1", // 완료 상태에 따라 투명도 조정
                }}
              >
                <CompleteButton
                  onClick={() => toggleComplete(event.todoId, index)}
                >
                  {event.todoDone && <CheckMark>✔</CheckMark>}
                </CompleteButton>
                <EventTitle>{event.todoTitle}</EventTitle>
                <EventTime>
                  {event.todoStartTime} ~ {event.todoEndTime}
                </EventTime>
                <EditButton
                  src={editIcon}
                  alt="수정"
                  onClick={() =>
                    !event.todoDone && handleEditClick(event.todoId)
                  }
                />
                <DeleteButton
                  src={deleteIcon}
                  alt="삭제"
                  onClick={() =>
                    !event.todoDone && handleDeleteClick(event.todoId)
                  }
                />
                <DeleteModal
                  isOpen={isDeleteConfirmModalOpen}
                  onClose={closeDeleteConfirmModal}
                  onConfirm={handleDelete}
                />
              </EventItem>
            ))}
          </EventList>
          <AddEventButton onClick={openNewEventModal}>
            + 새 노티 만들기
            {isModalOpen && (
              <ModalBackdrop>
                <ModalContainer onClick={e => e.stopPropagation()}>
                  <CloseButton
                    onClick={closeModal}
                    style={{ border: "none", backgroundColor: "white" }}
                  >
                    x
                  </CloseButton>
                  <DateHeader
                    style={{
                      borderBottom: `2px solid ${currentTheme[selectedColor]}`,
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
                    onChange={handleTitleChange}
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
                    {Object.keys(currentTheme)
                      .filter(key => key.startsWith("color"))
                      .map((colorKey, index) => (
                        <ColorOption
                          key={index}
                          color={currentTheme[colorKey]}
                          onClick={() => handleColorSelect(colorKey)}
                        />
                      ))}
                  </ColorSelector>
                  <SubmitButton
                    color={currentTheme[selectedColor]}
                    onClick={handleSubmit}
                  >
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
