/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import styled, {ThemeProvider} from "styled-components/native"
import React, { useState, useEffect } from 'react';
import {
	ScrollView,
	Text,
	Modal,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import images from "../components/images";
import NotiCheck from "../asset/noticheck.svg";
import Navigation_Bar from "../components/Navigation_Bar";
import { format } from "date-fns";
import { Calendar } from "react-native-calendars";


function Diary() {
	const navigation = useNavigation();
	const route = useRoute();
	const { selectedTheme } = route.params;
	const { date, title, contents } = route.params.diaryData;
	
	const color_sheet = [selectedTheme.color1, selectedTheme.color2, selectedTheme.color3, selectedTheme.color4, selectedTheme.color5];
	const name = "홍길동";
	const currentDate = new Date();
	const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
	const dayOfWeek = daysOfWeek[currentDate.getDay()];
	const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 ${dayOfWeek}요일`;

	const [clicked_modify, setClicked_modify] = useState(false);
	const [clicked_delete, setClicked_delete] = useState(false);
	const [modal_DeleteVisible, set_DeleteModalVisible] = useState(false);

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
						<HorisontalView style={{ justifyContent: 'flex-end', padding: 15 }}>
							<images.diary_modify width={20} height={20}
								color={clicked_modify ? color_sheet[0] : "#B7BABF"}
								style={{marginRight: 10}}
								onPress={() => setClicked_modify(!clicked_modify)} />
							<images.diary_delete width={20} height={20}
								color={clicked_delete ? color_sheet[0] : "#B7BABF"}
								onPress={() => {
									setClicked_delete(!clicked_delete);
									set_DeleteModalVisible(true);
								}} />
						</HorisontalView>

						<Container>
							<Text>Date: {date}</Text>
							<Text>Title: {title}</Text>
							<Text>Contents: {contents}</Text>
						</Container>

						<Modal
							animationType="slide"
							transparent={true}
							visible={modal_DeleteVisible}
							onRequestClose={() => set_DeleteModalVisible(false)}>
							<ModalContainer>
								<ModalView>
									<MainText style={{ margin: 20, fontSize: 15 }}>일기를 정말 삭제하시겠습니까? </MainText>
									<HorisontalView style={{alignItems: 'center', justifyContent: 'center'}}>
									<Delete
										onPress={() => {
											set_DeleteModalVisible(!modal_DeleteVisible);
											setClicked_delete(false);
											}}
										style={{backgroundColor: "#F2F3F5"}}
										>
										<Text>예</Text>
									</Delete>

									<Delete
										onPress={() => {
											set_DeleteModalVisible(!modal_DeleteVisible);
											setClicked_delete(false);
											}}
										style={{backgroundColor: selectedTheme.color1}}
										>
											
										<Text style={{color: "white"}}>아니요</Text>
									</Delete>
									</HorisontalView>
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

export default Diary;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

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
	margin-bottom: 20px;
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
    background-color: #B7BABF;
`;

const ModalContainer = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: flex-end;
    align-items: center;
`;

const ModalView = styled.View`
    background-color: white;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px
	width: 100%;
	height: 250px;
    align-items: center;
`;

const Delete = styled.TouchableOpacity`
	width: 120px;
	height: 40px;
	border-radius: 15px;
	justify-content: center;
	align-items: center;
	margin: 20px;
`;
