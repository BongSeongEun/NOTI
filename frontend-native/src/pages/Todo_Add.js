/* eslint-disable prettier/prettier */

import styled from "styled-components/native"

import React, { useState } from 'react';
import { Text, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import images from "../components/images";

function Todo_Add({ }) {
	const navigation = useNavigation();
	
	const [inputTitle, setInputTitle] = useState("");

	const [inputSDNum1, setInput_SDNum1] = useState("");
	const [inputSDNum2, setInput_SDNum2] = useState("");
	const [inputEDNum1, setInput_EDNum1] = useState("");
	const [inputEDNum2, setInput_EDNum2] = useState("");

	return (
		<Styles>
			<MainText>노티 제목</MainText>
			<InputBox>
				<TitleInput
					placeholder="노티 이름을 작성해주세요!  (한글 15자 이내/특수문자 입력 불가)"
					value={inputTitle}
					onChangeText={(text) => setInputTitle(text)}
				/>
			</InputBox>

			<MainText>노티 시간</MainText>
			<InputBox>
				<TextStyle>
					<Text_time>시작 시간                                                                                 </Text_time>
					<TimeInput
						placeholder="00"
						value={inputSDNum1}
						onChangeText={(text) => setInput_SDNum1(text)}
						keyboardType="numeric"
					/>
					<Text>:</Text>
					<TimeInput
						placeholder="00"
						value={inputSDNum2}
						onChangeText={(text) => setInput_SDNum2(text)}
						keyboardType="numeric"
					/>
				</TextStyle>
			</InputBox>
			<InputBox>
				<TextStyle>
					<Text_time>종료 시간                                                                                 </Text_time>
					<TimeInput
						placeholder="00"
						value={inputEDNum1}
						onChangeText={(text) => setInput_EDNum1(text)}
						keyboardType="numeric"
					/>
					<Text>:</Text>
					<TimeInput
						placeholder="00"
						value={inputEDNum2}
						onChangeText={(text) => setInput_EDNum2(text)}
						keyboardType="numeric"
					/>
				</TextStyle>
			</InputBox>

			<MainText>노티 색상</MainText>

			<ResultButton onPress={() => navigation.navigate("Todo")}>
				<ResultText color="white">완료</ResultText>
			</ResultButton>
		</Styles>
	);
}

const Styles = styled.View`
	flex: 1;
	display: flex;
  	justify-content: center;
	background-color: white;
`;

const TextStyle = styled(Styles)`
	flex-direction: row;
`;

const MainText = styled.Text`
	font-size: 12px;
	font-weight: bold;
	color: ${props => props.color || "black"};
	text-align: left;
	margin-left: 30px;
	margin-top: 30px;
`;

const InputBox = styled.TouchableOpacity`
	width: 300px;
	height: 40px;
	border-radius: 15px;
	background-color: #F2F3F5;
	flex-direction: row;
	align-items: center;
	margin-left: 30px;
`;

const TitleInput = styled.TextInput.attrs({maxLength: 15})`
	color: black;
    font-size: 8px;
	font-weight: normal;
	width: 100%;
  	height: 100%;
	margin-left: 15px;
`;

const TimeInput = styled.TextInput.attrs({ maxLength: 2})`
	color: black;
    font-size: 8px;
	font-weight: normal;
	width: 100%;
  	height: 100%;
	width: 50px;
  	height: 40px;
	text-align: center;
`;

const Text_time = styled.Text`
	color: black;
    font-size: 8px;
	font-weight: normal;
	margin-left: 15px;
`;

const ResultButton = styled.TouchableOpacity`
	width: 300px;
	height: 40px;
	border-radius: 15px;
	background-color: #FF7154;
	align-items: center;
	margin-left: 30px;
`;

const ResultText = styled(MainText)`
	margin-top: 10px;
`;

export default Todo_Add;