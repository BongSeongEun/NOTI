import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { ThemeProvider } from "styled-components";
import theme from "../styles/theme"; // 테마 파일 불러오기

const MemoContainer = styled.div`
  width: 70%;
  border: 1px solid ${props => props.theme.color1 || theme.OrangeTheme.color2};
  border-radius: 10px;
  padding: 20px;
  margin: 20px;
`;

const MemoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid
    ${props => props.theme.color1 || theme.OrangeTheme.color2};
  padding-bottom: 10px;
  margin-bottom: 20px;
`;

const MemoContent = styled.textarea`
  width: 100%;
  min-width: 100px;
  height: 300px;
  border: none;
  font-size: 16px;
`;

const SaveButton = styled.button`
  background-color: ${props => props.theme.color1 || theme.OrangeTheme.color2};
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 5px;
`;

function Memo({ teamId }) {
  const [memo, setMemo] = useState([]);
  const [editMode, setEditMode] = useState(false);

  const fetchMemo = async () => {
    try {
      const response = await axios.get(`/api/v1/getTeamMemo/${teamId}`);
      if (response.data && response.data.length > 0) {
        // 배열의 첫 번째 요소를 사용하여 메모 데이터 설정
        setMemo({
          memoContent: response.data[0].memoContent,
          teamMemoId: response.data[0].teamMemoId,
        });
      } else {
        // 서버에서 메모 데이터를 반환하지 않았을 경우, 초기 상태 설정
        setMemo({ memoContent: "", teamMemoId: null });
      }
    } catch (error) {
      console.error("Failed to fetch memo:", error);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `/api/v1/updateTeamMemo/${teamId}/${memo.teamMemoId}`,
        {
          memoContent: memo.memoContent,
        },
      );
      // 서버에서 업데이트된 메모 데이터를 단일 객체로 반환한다고 가정
      if (response.data) {
        // 업데이트된 메모 데이터를 상태에 반영
        setMemo({
          memoContent: response.data.memoContent,
          teamMemoId: response.data.teamMemoId,
        });
        setEditMode(false); // 편집 모드 종료
      }
    } catch (error) {
      console.error("Failed to update memo:", error);
    }
  };

  useEffect(() => {
    fetchMemo();
  }, [teamId]);

  return (
    <MemoContainer>
      <MemoHeader>
        <h3>MEMO</h3>
        {editMode ? (
          <SaveButton onClick={handleSave}>저장</SaveButton>
        ) : (
          <SaveButton onClick={() => setEditMode(true)}>수정 / 추가</SaveButton>
        )}
      </MemoHeader>
      {editMode ? (
        <MemoContent
          value={memo.memoContent}
          onChange={e => setMemo({ ...memo, memoContent: e.target.value })}
        />
      ) : (
        <p style={{ whiteSpace: "pre-wrap" }}>{memo.memoContent}</p>
      )}
    </MemoContainer>
  );
}

export default Memo;
