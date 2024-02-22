/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
import React from 'react';
import styled from 'styled-components/native';
import { View, Text } from 'react-native';

const TimeTableContainer = styled.View`
  flex-direction: column;
  margin-right: 35px;
  width: 60%;
  margin-top: 20px;
  min-width: 200px;
`;

const HourRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

const HourLabel = styled.Text`
  width: 50px;
  text-align: right;
  padding-right: 10px;
`;

const MinuteBlocks = styled.View`
  flex: 1;
  flex-direction: row;
`;

const MinuteBlock = styled.View`
  flex: 1;
  border: 1px solid #ddd;
  height: 20px;
  background-color: ${(props) => (props.opacity ? `rgba(0, 0, 0, ${props.opacity})` : "transparent")};
`;

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
                opacity={scheduleBlocks[hour * 6 + minute] ? scheduleBlocks[hour * 6 + minute] : 0}
              />
            ))}
          </MinuteBlocks>
        </HourRow>
      ))}
    </TimeTableContainer>
  );
}

export default ScheduleTimeTable;
