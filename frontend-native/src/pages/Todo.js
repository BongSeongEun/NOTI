/* eslint-disable quotes */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import styled, { ThemeProvider } from 'styled-components/native';

import React, { useState, useEffect, } from 'react';
import { ScrollView, TouchableOpacity, Text, Modal, } from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';
import 'react-native-gesture-handler';

import DecoesSvg from '../asset/Deco_Svg';
import { theme } from '../components/theme';
import images from '../components/images';
import Navigation_Bar from "../components/Navigation_Bar";

function Todo({ }) {
	const navigation = useNavigation();
	const route = useRoute();
	const { selectedTheme } = route.params;
	const name = "홍길동";

	const currentDate = new Date();
	const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
	const dayOfWeek = daysOfWeek[currentDate.getDay()];
	const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 ${dayOfWeek}요일`;

	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);
	const [clicked_check, setClicked_check] = useState(Array(5).fill(false));
	const [modalVisible, setModalVisible] = useState(false);

	// json 형식
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

	return (
		<ThemeProvider theme={selectedTheme}>
			<MainViewStyle>
				<ProfileContainer>
					<Profile source={images.profile}></Profile>
					<ProfileTextContainer>
						<MainText>
							{name} 님,
						</MainText>
						<MainText color={color_sheet[0]}>
							{formattedDate} 노티입니다!
						</MainText>
					</ProfileTextContainer>
				</ProfileContainer>

				<BarContainer>
					<MainText> 나의 일정      </MainText>
					<MainText onPress={() => navigation.navigate("Coop_Main", { selectedTheme: selectedTheme })} color="#B7BABF">      협업 일정</MainText>
				</BarContainer>

				<Bar>
					<Bar_Mini></Bar_Mini>
				</Bar>

				<Icons>
					<Icon_calendar width={20} height={20}
						color={clicked_calendar ? color_sheet[0] : "#B7BABF"}
						onPress={() => setClicked_calendar(!clicked_calendar)} />
					<images.share width={20} height={20}
						color={clicked_share ? color_sheet[0] : "#B7BABF"}
						onPress={() => setClicked_share(!clicked_share)} />
				</Icons>
				
				<NotiContainer>
					<>
						{Noties(0)}
						{Noties(1)}
						{Noties(2)}
						{Noties(3)}
					</>
					<AddNoti onPress={() => navigation.navigate("Todo_Add")} color="#E3E4E6">
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

				 <Navigation_Bar selectedTheme={selectedTheme} />

			</MainViewStyle>
		</ThemeProvider>
	);

}

const ProfileContainer = styled.View`
	display: flex;
	flex-direction: row;
`;

const MainViewStyle = styled.View`
	flex: 1;
	display: flex;
	background-color: white;
`;

const BarContainer = styled(ProfileContainer)`
	justify-content: center;
	align-items: center;
	margin-top: 20px;
`;

const ProfileTextContainer = styled(ProfileContainer)`
	flex-direction: column;
	margin-top: 25px;
	margin-left: 10px;
`;

const Profile = styled.Image`
	width: 40px;
	height: 40px;
	margin-top: 20px;
	margin-left: 50px;
`;

const MainText = styled.Text`
	font-size: 12px;
	font-weight: bold;
	color: ${props => props.color || "black"};
	text-align: left;
`;

const Bar = styled.TouchableOpacity`
	width: 100%;
	height: 1px;
	margin-top: 10px;
	background-color: #B7BABF;
`;

const Bar_Mini = styled(Bar)`
	width: 50%;
	height: 2px;
	background-color: ${props => props.theme.color1};
	margin-top: -1px;
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
	margin-left: 70px;
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