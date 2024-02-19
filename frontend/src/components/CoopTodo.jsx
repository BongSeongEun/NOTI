import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";
import theme from "../styles/theme"; // 테마 파일 불러오기
import AddEventButton from "../components/AddEventButton";
import DiaryContainer from "../components/DiaryContainer";
import editIcon from "../asset/fi-rr-pencil.png"; // 수정하기
import deleteIcon from "../asset/fi-rr-trash.png"; // 삭제하기
import DeleteModal from "../components/DeleteModal";

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

const TodoList = styled.div`
  width: 100%;
`;

const TodoItem = styled.div`
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

const AddTodoForm = styled.form`
  width: 100%;
  display: flex;
  margin-bottom: 20px;
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  margin-right: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:disabled {
    background-color: #ccc;
  }
`;

const EventList = styled.div`
  width: 100%;
`;

function CoopTodo({ teamId, onTodoChange }) {
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수
  const token = window.localStorage.getItem("token");

  // 일정 목록을 관리하기 위한 상태
  const [events, setEvents] = useState([]);

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
  const [selectedColor, setSelectedColor] = useState(theme.OrangeTheme.color1);

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

  // 테마 정보 가져오는 함수
  const fetchUserData = async userToken => {
    const userId = getUserIdFromToken(userToken); // 사용자 ID 가져오기
    try {
      const response = await axios.get(`/api/v1/userInfo/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      // 사용자의 테마 정보와 이미지 데이터를 서버로부터 받아옴
      const userThemeName = response.data.userColor; // 사용자의 테마 이름

      // 사용자의 테마를 상태에 적용
      if (theme[userThemeName]) {
        setCurrentTheme(theme[userThemeName]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // 색상 선택기에서 색상을 선택할 때 실행하는 함수
  const handleColorSelect = colorKey => {
    setSelectedColor(colorKey); // 색상 키워드를 상태에 저장
  };
  // 삭제
  const handleDeleteClick = teamTodoId => {
    setDeletingTodoId(teamTodoId);
    setIsDeleteConfirmModalOpen(true);
  };
  // 삭제
  const closeDeleteConfirmModal = teamTodoId => {
    setIsDeleteConfirmModalOpen(false);
    setDeletingTodoId(teamTodoId);
  };
  // 모달을 여는 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달을 닫는 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setTitle("");
  };
  // 새 일정 만들기 버튼 클릭 시 처리 함수
  const openNewEventModal = () => {
    // 입력 필드 상태 초기
    setSelectedColor(currentTheme.color1); // 기본 색상으로 초기화
    setIsEditing(false); // 편집 모드가 아닌 새 추가 모드로 설정
    setEditingTodoId(null); // 편집 중인 이벤트 ID 초기화
    openModal(); // 모달 창 열기
  };

  // 일정 완료 상태를 토글하는 함수
  const toggleComplete = async (teamTodoId, index) => {
    // 새로운 완료 상태 값을 정의합니다.
    const newCompletedStatus = !events[index].temaTodoDone;
    // 서버에 일정의 완료 상태를 업데이트하는 요청을 보냅니다.
    try {
      const response = await axios.put(
        `/api/v1/updateTeamTodo/${teamId}/${teamTodoId}`,
        {
          ...events[index], // 기존 일정 데이터를 펼침
          teamTodoDone: newCompletedStatus, // 완료 상태만 변경
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
            ? { ...event, teamTodoDone: newCompletedStatus }
            : event,
        );
        setEvents(updatedEvents);
      } else {
        // 서버 응답이 실패한 경우, 오류를 출력합니다.
        console.error("Failed to update todo status:", response);
      }
    } catch (error) {
      // 요청 중 오류가 발생한 경우, 오류를 출력합니다.
      console.error("Error updating todo status:", error);
    }
  };

  // 삭제
  const handleDelete = async () => {
    if (!deletingTodoId) return;
    try {
      const response = await axios.delete(
        `/api/v1/deleteTeamTodo/${teamId}/${deletingTodoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status === 200) {
        const updatedEvents = events.filter(
          event => event.teamTodoId !== deletingTodoId,
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

  // 팀의 Todo를 가져오는 함수
  const fetchTodos = async () => {
    try {
      const response = await axios.get(`/api/v1/getTeamTodo/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && Array.isArray(response.data)) {
        // 서버로부터 받은 일정 데이터에 대해 각 항목의 색상을 현재 테마에 맞는 색상으로 변환
        const updatedEvents = response.data.map(event => ({
          ...event,
          // 현재 테마에서 해당 색상 코드에 매핑된 색상을 찾거나, 매핑된 색상이 없으면 기본 색상을 사용
          teamSelectedColor:
            currentTheme[event.teamTodoColor] || event.teamTodoColor,
        }));
        setEvents(updatedEvents);
      }
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };
  // 수정하기 버튼 클릭 시 호출될 함수
  const handleEditSubmit = async e => {
    setIsEditing(true);
    const eventData = {
      teamTodoTitle: title,
      teamTodoColor: selectedColor,
      teamTodoDone: false,
    };

    try {
      const url = `/api/v1/updateTeamTodo/${teamId}/${editingTodoId}`;
      const response = await axios.put(url, eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        await fetchTodos(); // 일정 목록 새로고침
        closeModal(); // 모달 창 닫기
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  // 추가하기 버튼 클릭 시 호출될 함수
  const handleAddSubmit = async e => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    const eventData = {
      teamTodoTitle: title,
      teamTodoColor: selectedColor,
      teamTodoDone: false,
    };

    try {
      const url = `/api/v1/createTeamTodo/${teamId}`;
      const response = await axios.post(url, eventData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        closeModal(); // 모달 창 닫기
        await fetchTodos(); // 일정 목록 새로고침
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Error adding new event:", error);
    }
  };

  const handleEditClick = teamTodoId => {
    // 일정 목록에서 수정하려는 일정의 ID와 일치하는 일정을 찾습니다.
    const eventToEdit = events.find(event => event.teamTodoId === teamTodoId);
    if (eventToEdit) {
      // 상태를 업데이트하여 모달에 현재 값을 표시합니다.
      // 제목, 선택된 색상을 상태에 설정합니다.
      setTitle(eventToEdit.teamTodoTitle);
      setSelectedColor(eventToEdit.teamTodoColor); // 이전에는 eventToEdit.SelectedColor 였으나, 실제 프로퍼티 명과 일치해야 합니다.

      // 수정 중인 일정의 ID를 상태에 저장합니다.
      setEditingTodoId(eventToEdit.teamTodoId);

      // 수정 모드로 전환합니다.
      setIsEditing(true);

      // 모달 창을 엽니다.
      openModal();
    } else {
      console.error("Could not find the event to edit.");
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchTodos(); // 팀의 Todo 목록을 불러오는 함수 호출
  }, [onTodoChange]);

  const handleTitleChange = e => {
    console.log("Before setTitle:", title);
    setTitle(e.target.value);
    console.log("After setTitle, title is now:", e.target.value);
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <EventList>
        {events.map((event, index) => (
          <EventItem
            key={event.teamTodoId}
            style={{
              backgroundColor: event.teamSelectedColor, // 일정의 선택된 색상을 항상 사용
              opacity: event.teamTodoDone ? "0.5" : "1", // 완료 상태에 따라 투명도 조정
            }}
          >
            <CompleteButton
              onClick={() => toggleComplete(event.teamTodoId, index)}
            >
              {event.teamTodoDone && <CheckMark>✔</CheckMark>}
            </CompleteButton>
            <EventTitle>{event.teamTodoTitle}</EventTitle>
            <EditButton
              src={editIcon}
              alt="수정"
              onClick={() =>
                !event.teamTodoDone && handleEditClick(event.teamTodoId)
              }
            />
            <DeleteButton
              src={deleteIcon}
              alt="삭제"
              onClick={() =>
                !event.teamTodoDone && handleDeleteClick(event.teamTodoId)
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
      </AddEventButton>
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
                borderBottom: `2px solid ${currentTheme[selectedColor]}`,
                fontSize: "20px",
                height: "30px",
              }}
            ></DateHeader>
            <SubTextBox>노티 제목</SubTextBox>

            <InputField
              placeholder="노티이름을 작성해주세요!"
              value={title}
              onChange={handleTitleChange}
              maxLength={15}
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
              onClick={isEditing ? handleEditSubmit : handleAddSubmit}
            >
              {isEditing ? "수정하기" : "일정 추가"}
            </SubmitButton>
          </ModalContainer>
        </ModalBackdrop>
      )}
      {/* </AddEventButton> */}
    </ThemeProvider>
  );
}

export default CoopTodo;
