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
  border: 0.5px solid #ddd;
  height: 20px;
  background-color: ${props =>
    props.isFilled ? props.fillColor : "transparent"};
  transition:
    background-color 0.5s ease-in-out,
    transform 0.5s ease-in-out,
    opacity 0.5s ease-in-out;
`;

const TimeTable = ({ schedule }) => (
  <TimeTableContainer>
    {Array.from({ length: 24 }).map((_, hour) => (
      <HourRow key={hour}>
        <HourLabel>{`${hour < 10 ? `0${hour}` : hour}`}</HourLabel>
        <MinuteBlocks>
          {Array.from({ length: 6 }).map((__, minute) => (
            <MinuteBlock
              key={minute}
              isFilled={schedule[hour * 6 + minute]}
              fillColor={schedule[hour * 6 + minute] || "transparent"}
            />
          ))}
        </MinuteBlocks>
      </HourRow>
    ))}
  </TimeTableContainer>
);

export default TimeTable;
