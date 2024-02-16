import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";
import theme from "../styles/theme"; // 테마 파일 불러오기
import AddEventButton from "../components/AddEventButton";
import DiaryContainer from "../components/DiaryContainer";

const DeleteButton = styled.button`
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

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const token = window.localStorage.getItem("token");

  // 토큰 가져오는 함수
  const getUserIdFromToken = () => {
    const payload = token.split(".")[1];
    const base642 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = atob(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };

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

  // 팀의 Todo를 가져오는 함수
  const fetchTodos = async () => {
    const userId = getUserIdFromToken(); // 사용자 ID 가져오기
    try {
      const response = await axios.get(`/api/v1/getTeamTodo/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Failed to fetch todos:", error);
    }
  };

  // 새 Todo를 추가하는 함수
  const handleAddTodo = async event => {
    const userId = getUserIdFromToken(); // 사용자 ID 가져오기
    event.preventDefault();
    try {
      const response = await axios.post(
        `/api/v1/createTeamTodo/${teamId}`,
        { teamTodoTitle: newTodo },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        setNewTodo(""); // 입력 필드 초기화
        fetchTodos(); // Todo 목록을 다시 불러옴
        if (onTodoChange) onTodoChange(); // 부모 컴포넌트의 변경 처리 함수 호출
      }
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  // Todo를 삭제하는 함수
  const handleDeleteTodo = async todoId => {
    const userId = getUserIdFromToken(); // 사용자 ID 가져오기
    try {
      const response = await axios.delete(
        `/api/v1/deleteTeamTodo/${teamId}/${todoId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.status === 200) {
        fetchTodos(); // Todo 목록을 다시 불러옴
        if (onTodoChange) onTodoChange(); // 부모 컴포넌트의 변경 처리 함수 호출
      }
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  useEffect(() => {
    fetchUserData(token);
    if (teamId) fetchTodos();
  }, [teamId]);

  return (
    <ThemeProvider theme={currentTheme}>
      <EventList>
        <AddTodoForm onSubmit={handleAddTodo}>
          <Input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
          />
          <Button type="submit" disabled={!newTodo}>
            Add Todo
          </Button>
        </AddTodoForm>
        <TodoList>
          {todos.map(todo => (
            <TodoItem key={todo.teamTodoId}>
              {todo.teamTodoTitle}
              <Button onClick={() => handleDeleteTodo(todo.teamTodoId)}>
                Delete
              </Button>
            </TodoItem>
          ))}
        </TodoList>
      </EventList>
    </ThemeProvider>
  );
}

export default CoopTodo;
