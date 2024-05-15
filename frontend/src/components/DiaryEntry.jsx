import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import Emotion1 from "../asset/Emotion1.png";
import Emotion2 from "../asset/Emotion2.png";
import Emotion3 from "../asset/Emotion3.png";
import Emotion4 from "../asset/Emotion4.png";
import Emotion5 from "../asset/Emotion5.png";

const emotions = {
  1: Emotion1,
  2: Emotion2,
  3: Emotion3,
  4: Emotion4,
  5: Emotion5,
};

const DiaryEntryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 95%;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  position: relative; /* Position for absolute children */
  pointer-events: ${props =>
    props.isDisabled ? "none" : "auto"}; /* 클릭 방지 */
  opacity: ${props =>
    props.isDisabled ? 0.5 : 1}; /* 비활성화 시 불투명도 조정 */
`;

const DiaryTitle = styled.h2`
  margin: 0 0 10px 0;
  color: ${props => props.theme.color1};
`;

const DiaryDate = styled.div`
  margin-bottom: 5px;
  font-size: 0.8em;
  color: #666;
`;

const DiaryContent = styled.p`
  margin: 10px 0;
  color: #555;
`;

const DiaryImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  max-width: 500px; // 적절한 이미지 크기 설정
`;

const DiaryImage = styled.img`
  max-width: 100%;
  height: auto;
  margin-top: 10px;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  color: white;
  top: 10px;
  right: 10px;
  background-color: ${props => props.theme.color1};
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.color2};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: ${props => props.theme.color1};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${props => props.theme.color2};
  }
`;

const Input = styled.input`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  box-sizing: border-box;
`;

const TextArea = styled.textarea`
  margin-bottom: 10px;
  padding: 10px;
  width: 100%;
  height: 100px;
  box-sizing: border-box;
`;

const EmotionContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: ${props => props.theme.color1};
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out; // 부드러운 전환 효과

  &:hover {
    transform: scale(1.5); // 확대 비율 설정
  }
`;

const EmotionImage = styled.img`
  width: 70px;
  height: 70px;
`;

function DiaryEntry({ diary, onDelete, onSave, onRefresh, isEditingGlobal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(diary.diaryTitle);
  const [editedContent, setEditedContent] = useState(diary.diaryContent);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(diary.diaryImg);
  const [emotion, setEmotion] = useState(null); // 감정 상태 추가

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    },
  });

  const handleSave = async () => {
    const base64Image = selectedFile ? await toBase64(selectedFile) : preview;

    const updatedDiary = {
      ...diary,
      diaryTitle: editedTitle,
      diaryContent: editedContent,
      diaryImg: base64Image,
    };

    await onSave(updatedDiary);
    onRefresh(); // 일기 저장 후 재랜더링을 위해 호출

    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete(diary.diaryId);
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreview(null);
  };

  const fetchEmotionData = async (userId, diaryDate) => {
    try {
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v2/diaryEmotion/${userId}/${diaryDate}`,
      );
      setEmotion(response.data[diary.diaryDate]);
    } catch (error) {
      console.error("Error fetching emotion data:", error);
    }
  };

  useEffect(() => {
    const { userId } = diary;
    const diaryDate = diary.diaryDate.split(".").slice(0, 2).join(".");
    fetchEmotionData(userId, diaryDate);
  }, [diary]);

  return (
    <DiaryEntryContainer isDisabled={isEditingGlobal && !isEditing}>
      {!isEditing && emotion !== null && (
        <EmotionContainer>
          <EmotionImage src={emotions[emotion]} alt={`emotion ${emotion}`} />
        </EmotionContainer>
      )}
      {isEditing ? (
        <>
          <Input
            type="text"
            value={editedTitle}
            onChange={e => setEditedTitle(e.target.value)}
          />
          <TextArea
            value={editedContent}
            onChange={e => setEditedContent(e.target.value)}
          />
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            {preview ? (
              <DiaryImageContainer>
                <DiaryImage src={preview} alt="Diary" />
                {preview && (
                  <RemoveImageButton onClick={handleRemoveImage}>
                    이미지 삭제
                  </RemoveImageButton>
                )}
              </DiaryImageContainer>
            ) : (
              <p>이미지를 드래그하거나 클릭하여 업로드하세요</p>
            )}
          </div>
          <Button onClick={handleSave}>저장</Button>
        </>
      ) : (
        <>
          <DiaryDate>{diary.diaryDate}</DiaryDate>
          <DiaryTitle>{diary.diaryTitle}</DiaryTitle>
          <DiaryContent>{diary.diaryContent}</DiaryContent>
          {diary.diaryImg && (
            <DiaryImageContainer>
              <DiaryImage src={diary.diaryImg} alt="Diary" />
            </DiaryImageContainer>
          )}
          <ButtonContainer>
            <Button
              onClick={() => {
                setIsEditing(true);
              }}
            >
              수정
            </Button>
            <Button onClick={handleDelete}>삭제</Button>
          </ButtonContainer>
        </>
      )}
    </DiaryEntryContainer>
  );
}

export default DiaryEntry;
