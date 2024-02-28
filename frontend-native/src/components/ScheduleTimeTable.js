/* eslint-disable prettier/prettier */
import React from 'react';
import styled from 'styled-components/native';

const TimeTableContainer = styled.View`
	flex-direction: column;
	width: 100%;
	padding: 10px;
	background-color: #fff;
`;

const HourRow = styled.View`
	flex-direction: row;
	align-items: center;
`;

const HourLabel = styled.Text`
	width: 50px;
	padding-right: 10px;
	`;

const MinuteBlocks = styled.View`
	flex: 1;
	flex-direction: row;
`;

const MinuteBlock = styled.View`
	flex: 1;
	border-width: 1px;
	border-color: #ddd;
	height: 20px;
`;

const ScheduleTimeTable = ({ schedule, currentTheme }) => {
	return (
		<TimeTableContainer>
			{Array.from({ length: 24 }).map((_, hour) => (
				<HourRow key={hour}>
					<HourLabel>{`${hour < 10 ? `0${hour}` : hour}`}</HourLabel>
					<MinuteBlocks>
						{Array.from({ length: 6 }).map((__, minute) => {
							const index = hour * 6 + minute;
							const { r, g, b } = hexToRgb(currentTheme.color1);
							const backgroundColor = schedule[index] > 0
								? `rgba(${r}, ${g}, ${b}, ${schedule[index] * 0.4})`
								: 'transparent';
							return (
								<MinuteBlock
									key={minute}
									style={{ backgroundColor }}
								/>
							);
						})}
					</MinuteBlocks>
				</HourRow>
			))}
		</TimeTableContainer>
	);
};

const hexToRgb = (hex) => {
	const shortRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
	const hexFixed = hex.replace(shortRegex, (m, r, g, b) => r + r + g + g + b + b);
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexFixed);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16),
	} : null;
};

// 이 컴포넌트를 사용하는 부분에서 currentTheme.color1을 hex 코드로 전달해야 합니다.
export default ScheduleTimeTable;
