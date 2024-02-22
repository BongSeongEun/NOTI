import React from "react";
import styled from "styled-components";

const TimeTableContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 35px;
  width: 60%;
  margin-top: 20px;
  min-width: 200px;
`;

const HourRow = styled.div`
  display: flex;
  align-items: center;
`;

const HourLabel = styled.div`
  width: 50px;
  text-align: right;
  padding-right: 10px;
`;

const MinuteBlocks = styled.div`
  display: flex;
  flex: 1;
`;

const MinuteBlock = styled.div`
  flex: 1;
  border: 1px solid #ddd;
  height: 20px;
  background-color: ${props =>
    props.opacity ? `rgba(0, 0, 0, ${props.opacity})` : "transparent"};
`;

// TimeTableUI는 시각적 구조만 정의하고, isFilled 값은 외부에서 받습니다.
function ScheduleTimeTable({ scheduleBlocks }) {
  return (
    <TimeTableContainer>
      {Array.from({ length: 24 }).map((_, hour) => (
        <HourRow key={hour}>
          <HourLabel>{`${hour < 10 ? `0${hour}` : hour}`}</HourLabel>
          <MinuteBlocks>
            {Array.from({ length: 6 }).map((__, minute) => (
              <MinuteBlock
                key={minute}
                opacity={
                  scheduleBlocks[hour * 6 + minute]
                    ? scheduleBlocks[hour * 6 + minute]
                    : 0
                }
              />
            ))}
          </MinuteBlocks>
        </HourRow>
      ))}
    </TimeTableContainer>
  );
}

export default ScheduleTimeTable;
