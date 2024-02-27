import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";
import theme from "../styles/theme"; // 테마 파일 불러오기
import AddEventButton from "../components/AddEventButton";
import editIcon from "../asset/fi-rr-pencil.png"; // 수정하기
import deleteIcon from "../asset/fi-rr-trash.png"; // 삭제하기
import DeleteModal from "../components/DeleteModal";
import ScheduleTimeTable from "../components/ScheduleTimeTable"; // 변경된 부분

const HorizontalBox = styled.div`
  min-width: 600px;
  // 아이템을 가로정렬하는 상자
  display: flex; // 정렬하려면 이거 먼저 써야함
  flex-direction: row; // 가로나열
  /* justify-content: center; // 가운데 정렬 */
  width: 100%;
`;

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

const ScheduleItem = styled.div`
  /* 일정 항목 스타일 */
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center; /* 세로 중앙 정렬을 위해 */
  margin: 5px 0;
  cursor: pointer;
  &:hover {
    background-color: #f0f0f0;
  }
`;

const EventItem = styled.div`
  white-space: nowrap;
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
  white-space: nowrap;
  flex: 1; // 사용 가능한 공간 모두 사용
  padding-right: 10px; // 시간과 간격을 주기 위해
`;

const EditButton = styled.img`
  cursor: pointer;
  margin-left: 5px; // 시간과 아이콘 사이의 간격
  width: 15px;
  height: 15px;
`;

const CompleteButton = styled.div`
  min-width: 30px;
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

const DeleteButton = styled.img`
  min-width: 15px;
  //삭제 버튼
  cursor: pointer;
  margin-left: 10px; // 시간과 아이콘 사이의 간격 조정
  width: 15px;
  height: 15px;
`;

const EventList = styled.div`
  margin-top: 20px;
  width: 100%;
`;

const Event = styled.div`
  white-space: nowrap; // 시작 시간과 종료 시간을 같은 줄에 표시
`;

const DateSpan = styled.span`
  margin-right: 15px; // 오른쪽 마진으로 간격 추가
`;

const RegDiv = styled.div`
  margin-left: 15px;
  //회원가입 제일큰 박스
  height: auto;
  width: 85%; // 가로 50%
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column; // 내용 세로나열
`;

const VerticalBox = styled.div`
  // 아이템을 세로정렬하는 상자
  display: flex; // 정렬하려면 이거 먼저 써야함
  align-items: center; // 수직 가운데 정렬
  flex-direction: column; // 세로나열
  width: 100%;
  height: auto;
`;
const TextBox = styled.div`
  font-size: 17px;
`;

const AddSchedulesButton = styled.button`
  margin-right: 15px;
  margin-top: 10px;
  padding: 5px 10px;
  background-color: ${props => props.theme.color1 || theme.OrangeTheme.color1};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ButtonContainer = styled.div`
  margin-top: -15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  width: 100%; // 부모 컨테이너의 너비가 정의되어야 합니다.
`;

// 삭제 버튼 스타일 컴포넌트
const DeleteScheduleButton = styled.button`
  font-weight: bolder;
  width: 20px;
  padding: 0px;
  font-size: 100%;
  color: red;
  border: none;
  background-color: white;
`;

function CoopTodo({ teamId, onTodoChange, selectedDate }) {
  const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme); // 현재 테마 상태변수
  const token = window.localStorage.getItem("token");
  const [eventDate, setEventDate] = useState("");
  const [mySchedulesModalIsOpen, setMySchedulesModalIsOpen] = useState(false); // 내 일정 모달 상태
  const [mySchedules, setMySchedules] = useState([]); // 사용자의 일정 목록
  const [teamSchedules, setTeamSchedules] = useState([]);
  const [teamMembersCount, setTeamMembersCount] = useState(0);
  const [scheduleBlocks, setScheduleBlocks] = useState(Array(24 * 6).fill(0));

  const [todoStates, setTodoStates] = useState([]);

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
  // 수정하기에서 달력날짜 불러오는 함수
  const formatDateForInput = date => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2); // 월은 0부터 시작하므로 1을 더함
    const day = `0${d.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`; // YYYY-MM-DD 형식으로 반환
  };
  // 모달창 상태
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 새 일정의 제목, 시간, 색상 상태
  const [title, setTitle] = useState([]);
  const [selectedColor, setSelectedColor] = useState(theme.OrangeTheme.color1);

  // 날짜 입력 필드 변경 핸들러
  const handleDateChange = e => {
    setEventDate(e.target.value);
  };

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

  // 팀 일정과 팀원 수를 불러오는 함수
  const fetchTeamData = async () => {
    try {
      const teamSchedulesResponse = await axios.get(
        `/api/v1/getSchedule/${teamId}`,
      );
      const userTeamResponse = await axios.get(`/api/v1/getUserTeam/${teamId}`);

      setTeamSchedules(teamSchedulesResponse.data);
      setTeamMembersCount(userTeamResponse.data.length);
    } catch (error) {
      console.error("Failed to fetch team data:", error);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [teamId, onTodoChange]);

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
    setEventDate([]);
  };

  // 새 일정 만들기 버튼 클릭 시 처리 함수
  const openNewEventModal = () => {
    // 현재 날짜를 YYYY-MM-DD 형식으로 설정
    const today = new Date();
    const formattedDate = today.toISOString().substring(0, 10);

    // 입력 필드 상태 초기화
    setTitle(""); // 제목 초기화
    setEventDate(formattedDate); // 오늘 날짜로 초기화
    setSelectedColor(currentTheme.color1); // 기본 색상으로 초기화
    setIsEditing(false); // 편집 모드가 아닌 새 추가 모드로 설정
    setEditingTodoId(null); // 편집 중인 이벤트 ID 초기화
    openModal(); // 모달 창 열기
  };

  // 일정 완료 상태를 토글하는 함수
  const toggleComplete = async (teamTodoId, index) => {
    // 새로운 완료 상태 값을 정의합니다.
    const newCompletedStatus = !events[index].teamTodoDone;
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

  // 사용자의 일정 상태를 불러오는 함수
  const fetchTodoStates = async () => {
    const userId = getUserIdFromToken(); // 사용자 ID 가져오기
    try {
      const response = await axios.get(
        `/api/v1/getTodoState/${userId}/${teamId}`,
      );
      setTodoStates(response.data); // API 응답으로 받은 일정 상태를 상태 변수에 저장
    } catch (error) {
      console.error("Failed to fetch todo states:", error);
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
      teamTodoDate: formatDate(eventDate), // 날짜 데이터 포함
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
      teamTodoDate: formatDate(eventDate),
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
      setEventDate(formatDateForInput(eventToEdit.teamTodoDate));
      // 수정 모드로 전환합니다.
      setIsEditing(true);

      // 모달 창을 엽니다.
      openModal();
    } else {
      console.error("Could not find the event to edit.");
    }
  };

  const handleTitleChange = e => {
    console.log("Before setTitle:", title);
    setTitle(e.target.value);
    console.log("After setTitle, title is now:", e.target.value);
  };

  // D-Day 계산 함수 수정
  const calculateDDay = date => {
    const today = new Date();
    const targetDate = new Date(date);
    const difference = targetDate - today;
    const dDay = Math.ceil(difference / (1000 * 60 * 60 * 24));

    // D-Day가 음수일 경우 빈 문자열 반환
    if (dDay < 0) {
      return ""; // D-Day가 이미 지났을 경우, 표시하지 않음
    }
    if (dDay === 0) {
      return "D-Day"; // D-Day가 오늘일 경우 "Day" 표시
    }
    return `D-${dDay}`; // D-Day가 양수일 경우 "D-숫자" 표시
  };

  // 사용자의 일정을 불러오는 함수
  const fetchMySchedules = async () => {
    const userId = getUserIdFromToken(); // 토큰에서 사용자 ID 추출
    const formattedDate = formatDate(selectedDate); // 선택된 날짜를 YYYY-MM-DD 형식으로 변환

    try {
      // 서버 요청 시, 선택한 날짜(`selectedDate`)를 포함하여 요청
      const response = await axios.get(
        `/api/v1/getTodo/${userId}?date=${formattedDate}`,
      );
      // `todoStartTime`이 존재하며, 선택한 날짜에 해당하는 일정만 필터링
      const filteredSchedules = response.data.filter(
        scheduleItem =>
          scheduleItem.todoStartTime && scheduleItem.todoDate === formattedDate,
      );
      setMySchedules(filteredSchedules); // 필터링된 일정 데이터를 상태에 저장
    } catch (error) {
      console.error("Failed to fetch my schedules:", error);
    }
  };
  // 내 일정 추가 모달을 여는 함수
  const openMySchedulesModal = () => {
    fetchMySchedules(); // 모달을 열 때 사용자의 일정을 불러온다
    setMySchedulesModalIsOpen(true);
  };

  // 내 일정 추가 모달을 닫는 함수
  const closeMySchedulesModal = () => {
    setMySchedulesModalIsOpen(false);
  };

  // 일정을 선택하고 TimeTable에 추가하는 함수
  const handleSelectSchedule = async scheduleId => {
    // 선택된 일정으로 TimeTable 업데이트 로직
    try {
      await axios.post(
        `/api/v1/inputSchedule/${teamId}/${scheduleId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // closeMySchedulesModal(); // 요청 성공 시 모달 닫기
      onTodoChange(); // 부모 컴포넌트에서 데이터를 새로고침
    } catch (error) {
      console.error("Failed to input schedule:", error);
    }
  };

  useEffect(() => {
    const timeToIndex = time => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 6 + Math.floor(minutes / 10);
    };

    const updateScheduleBlocks = () => {
      const formattedSelectedDate = formatDateForInput(selectedDate);
      const schedulesForSelectedDate = teamSchedules.filter(
        scheduleItem =>
          formatDateForInput(scheduleItem.todoDate) === formattedSelectedDate,
      );

      const newScheduleBlocks = Array(24 * 6).fill(0);

      schedulesForSelectedDate.forEach(scheduleItem => {
        if (scheduleItem.todoStartTime && scheduleItem.todoEndTime) {
          const startIndex = timeToIndex(scheduleItem.todoStartTime);
          // 수정: 종료 시간을 포함하지 않도록 endIndex 계산 변경
          const endIndex = timeToIndex(scheduleItem.todoEndTime); // 여기에서 변경
          for (let i = startIndex; i < endIndex; i += 1) {
            // '<=' 에서 '<'로 변경
            newScheduleBlocks[i] += 1;
          }
        }
      });

      // 팀원 수로 나누어 각 블록의 투명도 결정
      const membersCount = teamMembersCount || 1; // 팀원 수가 0인 경우를 대비해 기본값 1 설정
      setScheduleBlocks(newScheduleBlocks.map(block => block / membersCount));
    };

    updateScheduleBlocks();
  }, [teamSchedules, teamMembersCount, selectedDate]);

  // 개인 일정을 TimeTable에서 삭제하는 함수 추가
  const handleDeleteSchedule = async todoId => {
    try {
      await axios.delete(`/api/v1/deleteSchedule/${teamId}/${todoId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // 성공적으로 삭제 후, TimeTable 및 개인 일정 목록 새로고침
      fetchMySchedules(); // 개인 일정 목록 다시 불러오기
      onTodoChange(); // TimeTable 업데이트를 위해 부모 컴포넌트의 변경사항 반영 함수 호출
    } catch (error) {
      console.error("Failed to delete the schedule:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchTodos(); // 팀의 Todo 목록을 불러오는 함수 호출
    if (mySchedulesModalIsOpen) {
      fetchMySchedules();
      fetchTodoStates();
    }
  }, [onTodoChange, selectedDate, mySchedulesModalIsOpen]);

  return (
    <ThemeProvider theme={currentTheme}>
      <HorizontalBox>
        <RegDiv>
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
                <Event>
                  <DateSpan>{formatDate(event.teamTodoDate)}</DateSpan>
                  <DateSpan>{calculateDDay(event.teamTodoDate)}</DateSpan>
                </Event>
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
                    height: "10px",
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
                <SubTextBox>노티 날짜</SubTextBox>
                <InputField
                  type="date"
                  value={eventDate}
                  onChange={handleDateChange}
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
        </RegDiv>
        <VerticalBox>
          <ButtonContainer>
            <AddSchedulesButton onClick={openMySchedulesModal}>
              + add Schedules
            </AddSchedulesButton>
          </ButtonContainer>
          <TextBox>{formatDate(selectedDate)}</TextBox>
          <div>
            {mySchedulesModalIsOpen && (
              <ModalBackdrop onClick={closeMySchedulesModal}>
                <ModalContainer onClick={e => e.stopPropagation()}>
                  <CloseButton
                    onClick={closeMySchedulesModal}
                    style={{ border: "none", backgroundColor: "white" }}
                  >
                    x
                  </CloseButton>
                  <h2>{formatDate(selectedDate)} 노티</h2>
                  {mySchedules.map(scheduleItem => {
                    // 해당 일정이 이미 추가된 상태인지 확인
                    const isAdded = todoStates.some(
                      todoState =>
                        todoState.todoId === scheduleItem.todoId &&
                        todoState.state,
                    );

                    // 이미 추가된 일정에는 특정 스타일을 적용
                    const itemStyle = isAdded
                      ? {
                          marginLeft: "10px",
                          opacity: "0.5",
                          textDecoration: "line-through",
                          pointerEvents: "none",
                          cursor: "default",
                        }
                      : {};

                    return (
                      <ScheduleItem
                        key={scheduleItem.todoId}
                        onClick={() =>
                          !isAdded
                            ? handleSelectSchedule(scheduleItem.todoId)
                            : null
                        }
                      >
                        {/* 삭제 버튼을 조건부로 렌더링 */}
                        {isAdded && (
                          <DeleteScheduleButton
                            onClick={e => {
                              e.stopPropagation(); // 부모 요소로의 이벤트 전파를 방지
                              handleDeleteSchedule(scheduleItem.todoId);
                            }}
                          >
                            —
                          </DeleteScheduleButton>
                        )}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1,
                            ...itemStyle,
                          }}
                        >
                          <div>{scheduleItem.todoTitle}</div> {/* Title */}
                          <div>
                            {scheduleItem.todoStartTime} {/* Start Time */}
                            {scheduleItem.todoEndTime &&
                              `~ ${scheduleItem.todoEndTime}`}{" "}
                            {/* End Time, if available */}
                          </div>
                        </div>
                      </ScheduleItem>
                    );
                  })}
                </ModalContainer>
              </ModalBackdrop>
            )}
            {/* 기존 TimeTable 및 기타 컴포넌트 렌더링 */}
          </div>
          <ScheduleTimeTable
            style={{ width: "300px", height: "450px", marginBottom: "5px" }}
            scheduleBlocks={scheduleBlocks} // schedule 상태를 scheduleBlocks prop으로 전달
          />
        </VerticalBox>
      </HorizontalBox>
    </ThemeProvider>
  );
}

export default CoopTodo;
