import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Calendar from "react-calendar";
import axios from "axios";

import theme from "../styles/theme";
import Emotion1 from "../asset/Emotion1.png";
import Emotion2 from "../asset/Emotion2.png";
import Emotion3 from "../asset/Emotion3.png";
import Emotion4 from "../asset/Emotion4.png";
import Emotion5 from "../asset/Emotion5.png";

const emotionImages = {
  1: Emotion1,
  2: Emotion2,
  3: Emotion3,
  4: Emotion4,
  5: Emotion5,
};

const StyledCalendar = styled(Calendar)`
  margin-bottom: 20px;
  width: auto;
  height: 600px;
  background-color: white;
  border: 1px solid ${props => props.theme.color1 || theme.OrangeTheme.color1};
  border-radius: 10px; // 달력 모서리를 둥글게
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin: 30px;

  .react-calendar__tile {
    text-align: center;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
  }
  /*hover, focus, 선택됐을 시 */
  .react-calendar__tile:enabled:hover,
  .react-calendar__tile:enabled:focus,
  .react-calendar__tile--active {
    border-radius: 14px;
  }
`;

function DiaryCalendar({ userId }) {
  const [emotions, setEmotions] = useState({});
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const fetchEmotionData = async diaryDate => {
    try {
      console.log(`Fetching emotion data for: ${diaryDate}`);
      const response = await axios.get(
        `http://15.164.151.130:4000/api/v2/diaryEmotion/${userId}/${diaryDate}`,
      );
      console.log("Response data:", response.data);
      setEmotions(response.data);
    } catch (error) {
      console.error("Error fetching emotion data:", error);
    }
  };

  useEffect(() => {
    const diaryDate = `${currentMonth.getFullYear()}.${(
      currentMonth.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}`;
    console.log(`Current month in useEffect: ${diaryDate}`);
    fetchEmotionData(diaryDate);
  }, [userId, currentMonth]);

  const formatDate = date => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateString = formatDate(date);
      const emotionLevel = emotions[dateString];
      if (emotionLevel) {
        return (
          <img
            src={emotionImages[emotionLevel]}
            alt={`Emotion ${emotionLevel}`}
            style={{ width: "50px", height: "50px" }}
          />
        );
      }
    }
    return null;
  };

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    console.log(`Active start date changed to: ${activeStartDate}`);
    setCurrentMonth(activeStartDate);
  };

  return (
    <>
      <StyledCalendar
        tileContent={tileContent}
        onActiveStartDateChange={handleActiveStartDateChange}
      />
    </>
  );
}

export default DiaryCalendar;
