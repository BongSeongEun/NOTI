/* eslint-disable no-trailing-spaces */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */

import styled, {ThemeProvider} from "styled-components/native"
import React, { useState, useEffect } from 'react';
import {
	ScrollView,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import images from "../components/images";
import NotiCheck from "../asset/noticheck.svg";
import Navigation_Bar from "../components/Navigation_Bar";
import { format } from "date-fns";
import { Calendar } from "react-native-calendars";

function Coop({ }) {
	const navigation = useNavigation();
	const route = useRoute();
	
	const { selectedTheme } = route.params;
	const color_sheet = [selectedTheme.color1, selectedTheme.color2, selectedTheme.color3, selectedTheme.color4, selectedTheme.color5];
	const name = "홍길동";
	const currentDate = new Date();
	const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
	const dayOfWeek = daysOfWeek[currentDate.getDay()];
	const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 ${dayOfWeek}요일`;

	const Team_Title = "졸업작품 팀 프로젝트";
	const team_todo = ['유산소 운동', '강아지 산책', '스터디'];

	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);
	const [color_num, setColorNum] = useState(0);
	const [clicked_check, setClicked_check] = useState(Array(5).fill(false));

	useEffect(() => { setColorNum(color_num + 1); }, []);
	const handleAddNoti = () => {
		setColorNum((prevColorIndex) => (prevColorIndex + 1) % color_sheet.length);
	};

	const handleCheckToggle = (color_num) => {
		setClicked_check((prevClickedChecks) => {
			const newClickedChecks = [...prevClickedChecks];
			newClickedChecks[color_num] = !prevClickedChecks[color_num];
			return newClickedChecks;
		});
	}

	const Noties = (color_num) => (
		<Noti color={clicked_check[color_num] ? `${color_sheet[color_num]}80` : color_sheet[color_num]}>
			<Noti_Check onPress={() => {
				handleCheckToggle(color_num);
				handleAddNoti();
			}}>
				<images.noticheck width={15} height={15}
					color={clicked_check[color_num] ? `${color_sheet[color_num]}80` : "#B7BABF"} />
		  	</Noti_Check>
		  	<NotiText> {team_todo[color_num]} </NotiText>
		</Noti>
	);

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
						<HorisontalView style={{marginTop: 30, marginBottom: 10}}>
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
				<BarContainer>
					<MainText onPress={() => navigation.navigate('Todo', { selectedTheme: selectedTheme })}
						style={{ marginRight: 20 }}>나의 일정</MainText>
                    <MainText style={{ marginLeft: 20 }}>협업 일정</MainText>
                </BarContainer>
				<Bar />
				<Bar_Mini />

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

						<MainText style={{ fontSize: 15, textAlign: 'center' }}>{Team_Title}</MainText>
						
						<NotiContainer>
							<>
								{Noties(0)}
								{Noties(1)}
								{Noties(2)}
							
							</>
						</NotiContainer>
						
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

const BarContainer = styled.View`
	flex-direction: row;
	align-items: center;
	justify-content: center;
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

const Bar_Mini = styled(Bar)`
    align-self: flex-end;
    width: 50%;
    height: 2px;
    background-color: ${props => props.theme.color1};
    margin-top: 0px;
`;

const NotiContainer = styled.View`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 15px;
`;

const Noti = styled.TouchableOpacity`
	width: 300px;
	height: 40px;
	border-radius: 15px;
	background-color: ${props => props.color || "#FF7154"};
	flex-direction: row;
	align-items: center;
	margin: 5px;
`;

const Noti_Check = styled.TouchableOpacity`
	width: 25px;
	height: 25px;
	border-radius: 100px;
	background-color: white;
	margin-left: 10px;
	justify-content: center;
	align-items: center;
`;

const NotiText = styled.Text`
	font-size: 13px;
	font-weight: normal;
	color: ${props => props.color || "white"};
	text-align: left;
	margin-left: 10px;
`;

const Icons = styled.Image`
	width: 15px;
	height: 15px;
	margin: 20px;
`;

export default Coop;