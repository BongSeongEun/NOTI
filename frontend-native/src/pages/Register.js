/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
import styled from "styled-components/native"

import React from 'react';
import { View, Text, Button, Imgae } from "react-native";
import { useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import proflie from "../asset/profile.png";

function Register({ }) {
	const navigation = useNavigation();
	return (
		<Style>
			<MainText>가입을 축하드려요! {'\n'} 프로필을 등록해보세요</MainText>
			<ProflieImg source={proflie} />
			<Button
				title="완료"
				onPress={() => navigation.navigate("Main")}>
			</Button>
		</Style>
	);
}

const Style = styled.View`
	display: flex;
  	align-items: center;
  	justify-content: center;
`;

const MainText = styled.Text`
    color: black;
    font-size: 15px;
	font-weight: bold;
    font-family: Pretendard;
	text-align: center;
	margin: 30px;

`;

const ProflieImg = styled.Image`
	width: 100px;
  	height: 100px;
	margin: auto;
`;

export default Register;