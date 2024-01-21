/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */

import styled from "styled-components/native"

import React from 'react';
import {
	View,
	Text,
	Button,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import 'react-native-gesture-handler';

import images from "../components/images";
import NotiCheck from "../asset/noticheck.svg"; //color

function Todo({ }) {
	const navigation = useNavigation();
	const name = "홍길동";
	const currentDate = new Date();
	const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일`;
	
	const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토']
  	const dayOfWeek = daysOfWeek[currentDate.getDay()];

	return (
		<MainViewStyle>
			<ProfileContainer>
				<Profile source={images.Profile_g}></Profile>
				<ProfileTextContainer>
					<MainText>
						{name} 님,
					</MainText>
					<MainText color="#FF7154">
						{formattedDate} {dayOfWeek} 노티입니다!
					</MainText>
				</ProfileTextContainer>
			</ProfileContainer>

			<Bar></Bar>
		</MainViewStyle>
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

const ProfileTextContainer = styled(ProfileContainer)`
	flex-direction: column;
	margin-top: 30px;
	margin-left: 10px;
`;

const Profile = styled.Image`
	width: 50px;
	height: 50px;
	margin-top: 20px;
	margin-left: 50px;
`;

const MainText = styled.Text`
	font-size: 12px;
	font-weight: bold;
	color: ${props => props.color || "black"};
	text-align: left;
`;

const Icons = styled.Image`
	width: 15px;
	height: 15px;
	margin: 30px;
`;

const Bar = styled.TouchableOpacity`
	width: 100%;
	height: 1px;
	margin-top: 30px;
	background-color: #B7BABF;
`;

const NotiContainer = styled.View`
`;

const Noti = styled.TouchableOpacity`
`;

const NotiText = styled.Text`
`;

const AddNoti = styled.TouchableOpacity`
`;

export default Todo;