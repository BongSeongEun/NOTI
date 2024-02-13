/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import styled, { ThemeProvider } from "styled-components/native"

import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	StyleSheet
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import 'react-native-gesture-handler';

import images from "../components/images";
import Navigation_Bar from "../components/Navigation_Bar";
import { theme } from '../components/theme';
import { format } from "date-fns";


function Diary({ }) {
	const navigation = useNavigation();
	const route = useRoute();
	const { selectedTheme } = route.params;
	const color_sheet = [selectedTheme.color1, selectedTheme.color2, selectedTheme.color3, selectedTheme.color4, selectedTheme.color5];

	const name = "홍길동";

	const currentDate = new Date();
	const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
	const dayOfWeek = daysOfWeek[currentDate.getDay()];
	const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 ${dayOfWeek}요일`;

	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);

	const posts = [
		{
		  id: 1,
		  title: "제목입니다.",
		  contents: "내용입니다.",
		  date: "2024-02-10",
		},
		{
		  id: 2,
		  title: "제목입니다.",
		  contents: "내용입니다.",
		  date: "2024-02-12",
		}
	];
	const markedDates = posts.reduce((acc, current) => {
		const formattedDate = format(new Date(current.date), 'yyyy-MM-dd');
		acc[formattedDate] = {marked: true};
		return acc;
	}, {});
	
	const [selectedDate, setSelectedDate] = useState(
		format(new Date(), "yyyy-MM-dd"),
	);
	const markedSelectedDates = {
		...markedDates,
		[selectedDate]: {
			selected: true,
			marked: markedDates[selectedDate]?.marked,
		}
	};

	return (
		<ThemeProvider theme={selectedTheme}>
			<FullView>
					<MainView>
						<HorisontalView style={{marginTop: 30, marginBottom: 0}}>
							<Profile source={images.profile} style={{ marginTop: 20 }} />
							<ProfileTextContainer>
								<MainText>
									{name} 님,
								</MainText>
								<MainText color={color_sheet[0]}>
									{formattedDate} 노티입니다!
								</MainText>
							</ProfileTextContainer>
						</HorisontalView>
				</MainView>
			</FullView>
			
			<FullView style={{flex: 1}}>
				<Bar />

				<ScrollView>
					<MainView>
						<HorisontalView style={{ justifyContent: 'space-between', padding: 20}}>
							<images.calendar width={20} height={20}
							color={clicked_calendar ? color_sheet[0] : "#B7BABF"}
							onPress={() => setClicked_calendar(!clicked_calendar)} />
							<images.share width={20} height={20}
							color={clicked_share ? color_sheet[0] : "#B7BABF"}
									onPress={() => setClicked_share(!clicked_share)} />
						</HorisontalView>

						{clicked_calendar && (
							<>
								<Calendar 
									markedDates={markedSelectedDates}
									theme={{
										selectedDayBackgroundColor: selectedTheme.color1,
										arrowColor: selectedTheme.color1,
										dotColor: selectedTheme.color1,
										todayTextColor: selectedTheme.color1,
									}} 
									onDayPress={(day) => {
										setSelectedDate(day.dateString)
								}} />
							</>
						)}
						
					</MainView>
				</ScrollView>

				<Navigation_Bar selectedTheme={selectedTheme} />
			</FullView>
		</ThemeProvider>	
	);
}

const FullView = styled.View`
	width: 100%;
	background-color: white;
`;

const MainView = styled(FullView)`
	height: auto;
	align-self: center;
	width: 300px;
`;

const HorisontalView = styled(MainView)`
	flex-direction: row;
`;


const ProfileContainer = styled.View`
    display: flex;
    flex-direction: row;
`;


const ProfileTextContainer = styled(ProfileContainer)`
	flex-direction: column;
	margin-top: 25px;
	margin-left: 15px;
	margin-bottom: 25px;
`;

const Profile = styled.Image`
    width: 40px;
    height: 40px;
    margin-left: 20px;
`;

const MainText = styled.Text`
    font-size: ${props => props.fontSize || "12px"};
    font-weight: bold;
    color: ${props => props.color || "black"};
    text-align: left;
`;

const Bar = styled.View`
    width: 100%;
    height: 1px;
    margin-top: 10px;
    background-color: #B7BABF;
`;

const DiaryContainer = styled.View`
	position: relative;
	width: 300px;
	height: 500px;
	margin-bottom: 10px;
`;

export default Diary;