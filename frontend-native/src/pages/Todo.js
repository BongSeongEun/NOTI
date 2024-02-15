/* eslint-disable quotes */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import styled, { ThemeProvider } from 'styled-components/native';

import React, { useState, useEffect, } from 'react';
import { ScrollView, TouchableOpacity, Text, Modal, } from 'react-native';

import { useNavigation, useRoute } from "@react-navigation/native";
import { Calendar } from "react-native-calendars";
import 'react-native-gesture-handler';

import images from "../components/images";
import Navigation_Bar from "../components/Navigation_Bar";
import { theme } from '../components/theme';
import { format } from "date-fns";

function Todo({ }) {
	const navigation = useNavigation();
	const route = useRoute();
	const { selectedTheme } = route.params || { selectedTheme: theme.DefaultTheme };
	const name = "홍길동";

	const currentDate = new Date();
	const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
	const dayOfWeek = daysOfWeek[currentDate.getDay()];
	const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 ${dayOfWeek}요일`;

	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);
	const [clicked_check, setClicked_check] = useState(Array(5).fill(false));
	const [modalVisible, setModalVisible] = useState(false);

	// json 형식으로 받아옴,,,? 어케하는데
	const NotiTitle = ["일정 1", "일정 2", "일정 3"];
	const Noti_Time = ["16:30 ~ 17:00", "17:30 ~ 18:40", "19:00~20:00"];

	const color_sheet = [selectedTheme.color1, selectedTheme.color2, selectedTheme.color3, selectedTheme.color4, selectedTheme.color5];

	const [color_num, setColorNum] = useState(0);
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
		<Noti color={clicked_check[color_num] ? `${color_sheet[color_num]}80` : color_sheet[color_num]} onPress={() => setModalVisible(true)}>
			<NotiCheck onPress={() => {
				handleCheckToggle(color_num);
				handleAddNoti();
			}}>
				<images.noticheck width={15} height={15}
					color={clicked_check[color_num] ? `${color_sheet[color_num]}80` : "#B7BABF"} />
		  	</NotiCheck>
		  	<NotiText> {NotiTitle[color_num]} </NotiText>
		 	<NotiTime> {Noti_Time[color_num]} </NotiTime>
		</Noti>
	);

	/*
	const CreateNoties = () => {
        return (
            <>
                <Text>Title: {inputTitle}</Text>
                <Text>Start Time: {selectedStartTime}</Text>
                <Text>End Time: {selectedEndTime}</Text>
                <Text>Color: {selectedColor}</Text>
            </>
        );
    };
	*/

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
					<MainText style={{ marginRight: 20 }} >나의 일정</MainText>
                    <MainText onPress={() => navigation.navigate('Coop_Main', { selectedTheme: selectedTheme })}
						style={{ marginLeft: 20, color: "#B7BABF" }}>협업 일정</MainText>
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
				
				<NotiContainer>
					<>
						{Noties(0)}
						{Noties(1)}
						{Noties(2)}
						{Noties(3)}
					
					</>
					<AddNoti onPress={() => navigation.navigate("Todo_Add", { selectedTheme: selectedTheme })} color="#E3E4E6">
						<NotiText color="black">+ 새 노티 추가하기  </NotiText>
					</AddNoti>
				</NotiContainer>
				

				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={() => {
					setModalVisible(!modalVisible);
					}}
				>
					<ModalContainer>
						<ModalView>
							<ModalContent>
								<TouchableOpacity onPress={() => {
									navigation.navigate("Todo_Add");
									setModalVisible(!modalVisible);
								}}>
									<Text>수정하기</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => {
									setModalVisible(!modalVisible);
								}}>
									<Text>삭제하기</Text>
								</TouchableOpacity>
								<TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
									<Text>닫기</Text>
								</TouchableOpacity>
							</ModalContent>
						</ModalView>
					</ModalContainer>
				</Modal>
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
	align-items: stretch;
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
    align-self: flex-start;
    width: 50%;
    height: 2px;
    background-color: ${props => props.theme.color1};
    margin-top: 0px;
`;

const NotiContainer = styled.View`
	display: flex;
	justify-content: center;
	align-items: center;
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

const NotiCheck = styled.TouchableOpacity`
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

const NotiTime = styled(NotiText)`
	text-align: right;
	margin-left: 100px;
`;

const AddNoti = styled(Noti)`
	margin: 15px;
	width: 150px;
	justify-content: center;
`;

const Icons = styled.View`
	display: flex;
	flex-direction: row;
	margin-left: 10px;
	margin-top: 15px;
`;

const Icon_calendar = styled(images.calendar)`
	margin-right: 230px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const ModalView = styled.View`
  margin: 20px;
  background-color: white;
  border-radius: 20px;
  padding: 35px;
  align-items: center;
`;

const ModalContent = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Todo;