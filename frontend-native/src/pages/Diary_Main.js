/* eslint-disable quotes */
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


function Diary_Main({ }) {
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
	//const [clicked_DiaryFrame, setClicked_DiaryFrame] = useState(false);

	const posts = [
		{
		  id: 1,
		  title: "하루 일기",
		  contents: "내용입니다.",
		  date: "2024-02-10",
		},
		{
		  id: 2,
		  title: "하루 일기",
		  contents: "내용입니다.",
		  date: "2024-02-12",
		},
		{
			id: 3,
			title: "하루 일기",
			contents: "날씨는 토요일, 이태원에서 고등학교 친구인 나현이와 2시에 만남을 가졌다. \n 우리는 먼저 삼겹살집으로 향했다. 고등학교 시절의 추억을 떠올리며 삼겹살과 함께 한 잔의 소주는 정말 최고였다. 맛있는 음식과 함께 나눈 대화는 시간이 어떻게 흘렀는지 모를 만큼 즐거웠다. \n 1차에서는 끝나지 않고, 우린 2차로 소고기전골집을 향했다. 뜨끈한 소고기전골과 함께 한 잔의 소주는 특별한 순간으로 기억될 것이다. 시간 가는 줄 모르고 먹고 마시다 보니 막차를 놓치고 나현이네 집으로 향하게 되었다. \n 나현이네 집에서는 고등학교 시절의 추억을 떠올리며 웃음 속에 취해서 잠이 들었다. 그리고 다음날, 주말은 술과 함께 흐르고 말았다. \n 그리고 주말의 끝에는 현실이 다가왔다. 새로 시작된 알고리즘 계절학기 수업은 예상치 못한 어려움과 함께 찾아왔다. 수업은 지루하고 힘들게 느껴졌다. 나현이와의 즐거운 주말이 떠올라 더욱 힘든 상황이었다. \n 하지만, 이 모든 어려움도 언젠가는 극복될 것이다. 즐거운 순간들을 떠올리며 앞으로의 도전에 기대를 갖고 살아가야겠다.",
			date: "2024-02-13",
		},
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

	const DiaryFrame = ({ diaryId, colorSheet }) => {
		const post = posts.find(p => p.id === diaryId);
	
		return (
			<DiaryContainer>
				<Diary_Frame>
					<MainText style={{top: 10, color: colorSheet[0], alignSelf: 'center' }}>
						{post.date}
					</MainText>
					<MainText style={{top: 10, alignSelf: 'center' }}>
						{post.title}
					</MainText>
					<DiaryText style={{ top: 20, left: 10, marginRight: 20 }}>
						{truncateText(post.contents)}
					</DiaryText>
					<DiaryText style={{ top: 10, left: 10, color: '#B7BABF', marginRight: 20 }}>
						더보기...
					</DiaryText>

					<Diary_Image style={{top: 30, alignSelf: 'center' }}/>
				</Diary_Frame>
		  </DiaryContainer>
		);
	};

	const truncateText = (text) => {
		const lines = text.split('\n');
		const maxLines = 8;
		const maxCharacters = 250;
	  
		let truncatedText = '';
	  
		for (let i = 0; i < lines.length && i < maxLines; i++) {
		  if (truncatedText.length + lines[i].length > maxCharacters) {
			truncatedText += lines[i].substring(0,  truncatedText.length) + '...';
			break;
		  } else {
			truncatedText += lines[i] + '\n';
		  }
		}
		return truncatedText.trim();
	};
	  

	return (
		<ThemeProvider theme={selectedTheme}>
			<FullView>
					<MainView>
						<HorisontalView style={{marginTop: 30 }}>
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

						{posts.sort((a, b) => b.id - a.id).map(post => (
							<DiaryFrame key={post.id} diaryId={post.id} colorSheet={color_sheet} />
						))}
						
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

const DiaryText = styled(MainText)`
	font-size: 8px;
	font-weight: normal;
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
	height: 350px;
`;

const Diary_Frame = styled.TouchableOpacity`
	width: 300px;
	height: 300px;
	border-width: 1px;
	border-color: #B7BABF;
	padding: 10px;
	border-radius: 15px;
`;

const Diary_Image = styled.TouchableOpacity`
	width: 260px;
	height: 120px;
	background-color: #B7BABF;
	border-radius: 15px;
`;

export default Diary_Main;