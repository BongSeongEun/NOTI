/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import styled from "styled-components/native"

import React, { useState } from 'react';
import {
	Text,
	ScrollView,
	Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import images from "../components/images";

function Register({ }) {
	const navigation = useNavigation();
	const name = "홍길동";
	const email = "streethong@naver.com";
	const [inputName, setInput_name] = useState("");
	const [inputSDNum1, setInput_SDNum1] = useState("");
	const [inputSDNum2, setInput_SDNum2] = useState("");
	const [inputEDNum1, setInput_EDNum1] = useState("");
	const [inputEDNum2, setInput_EDNum2] = useState("");
	const [clicked, setClicked] = useState(false);
	
	return (
		<ScrollView>
			<Style>
			  	<MainText>가입을 축하드려요! {'\n'} 프로필을 등록해보세요</MainText>
	
			  	<ProfileGalleryContainer>
          			<ProfileImg source={images.profile} />

          			<GalleryButtonContainer>
            			<GalleryButton source={images.gallery}>
            		    	<Gallery source={images.gallery} />
            			</GalleryButton>
          			</GalleryButtonContainer>
        		</ProfileGalleryContainer>
	
			  	<RegularText>이름</RegularText>
			  	<FixTextBox>
					<FixTextBox_Input>{name}</FixTextBox_Input>
			  	</FixTextBox>
	
			  	<RegularText>닉네임 *</RegularText>
			  	<RegularTextBox>
					<RegularTextBox_Input
				  		placeholder="닉네임(한글 6자 이내/특수문자 입력 불가)"
				  		value={inputName}
				  		onChangeText={(text) => setInput_name(text)}
					/>
				</RegularTextBox>
				
				<RegularText>이메일</RegularText>
			  	<FixTextBox>
					<FixTextBox_Input>{email}</FixTextBox_Input>
			  	</FixTextBox>
		
				<RegularText>방해금지 시간 설정
					<DisturbTimeContainer>
						<DisturbTimeButton
							onPress={() => setClicked((bool) => !bool)}
							clicked={clicked} />
						<DisturbTimeButton_Circle
							onPress={() => setClicked((bool) => !bool)}
							clicked={clicked} />
					</DisturbTimeContainer>
				</RegularText>

				{ clicked && (
					<>
						<RegularTextBox>
					<Text1>시작 시간                                                                                 </Text1>
						<DisturbTimeButton_Input
				  			placeholder="00"
							value={inputSDNum1}
							onChangeText={(text) => setInput_SDNum1(text)}
							keyboardType="numeric"
						/>
						<Text>:</Text>
						<DisturbTimeButton_Input
							placeholder="00"
							value={inputSDNum2}
							onChangeText={(text) => setInput_SDNum2(text)}
							keyboardType="numeric"
						/>
				</RegularTextBox>
				<RegularTextBox>
					<Text1>종료 시간                                                                                 </Text1>
						<DisturbTimeButton_Input
				  			placeholder="00"
							value={inputEDNum1}
							onChangeText={(text) => setInput_EDNum1(text)}
							keyboardType="numeric"
						/>
						<Text>:</Text>
						<DisturbTimeButton_Input
							placeholder="00"
							value={inputEDNum2}
							onChangeText={(text) => setInput_EDNum2(text)}
							keyboardType="numeric"
						/>
				</RegularTextBox>
					</>
				)}
				

				<RegularText>테마 선택</RegularText>
				
				<ResultButton onPress={() => navigation.navigate("Register_Success")}>
  					<ResultButton_Text>완료</ResultButton_Text>
				</ResultButton>

			</Style>
		</ScrollView>
	);
}

const Style = styled.View`
	display: flex;
  	justify-content: center;
	background-color: white;
`;

const MainText = styled.Text`
    color: black;
    font-size: 15px;
	font-weight: bold;
    font-family: Pretendard;
	text-align: center;
	margin: 30px;
`;

const Text1 = styled.Text`
    color: black;
    font-size: 8px;
	font-weight: normal;
    font-family: Pretendard;
	text-align: left;
	margin-left: 15px;
`;

const RegularText = styled.Text`
	color: black;
    font-size: 8px;
	font-weight: bold;
    font-family: Pretendard;
	text-align: left;
	margin-left: 60px;
	margin-top: 20px;
`;

const ProfileGalleryContainer = styled.View`
	position: relative;
`;

const ProfileImg = styled.Image`
	width: 100px;
  	height: 100px;
	margin: auto;
`;

const GalleryButtonContainer = styled.View`
  position: absolute;
  bottom: 0px;
  right: 150px; 
`;

const GalleryButton = styled.TouchableOpacity`
	width: 40px;
	height: 40px;
  	background-color: #FF7154;
  	border-radius: 100px;
`;

const Gallery = styled.Image`
	width: 20px;
	height:20px;
	margin: auto;
`;

const FixTextBox = styled.TouchableOpacity`
	width: 300px;
	height: 40px;
	background-color: #E3E4E6;
	border-radius: 15px;
	margin-left: 50px;
	margin-top: 10px;
`;

const FixTextBox_Input = styled.Text`
	color: black;
    font-size: 8px;
	font-weight: normal;
	width: 100%;
  	height: 100%;
	margin-left: 15px;
	margin-top: 15px;
`;

const RegularTextBox = styled.TouchableOpacity`
	width: 300px;
	height: 40px;
	background-color: #F2F3F5;
	border-radius: 15px;
	margin-left: 50px;
	margin-top: 10px;
	flex-direction: row;
	align-items: center;
`;

const RegularTextBox_Input = styled.TextInput.attrs({maxLength: 6,})`
	color: black;
    font-size: 8px;
	font-weight: normal;
	width: 100%;
  	height: 100%;
	margin-left: 15px;
`;

const DisturbTimeContainer = styled.View`
  	flex-direction: row;
  	justify-content: flex-start;
`;

const DisturbTimeButton = styled.TouchableOpacity`
	background-color: ${({ clicked }) => (clicked ? '#FF7154' : '#D5D5DB')};
	border-radius: 10px;
	width: 35px;
	height: 15px;
	margin-left: 190px;
`;

const DisturbTimeButton_Circle = styled.TouchableOpacity`
	background-color: white;
	border-radius: 100px;
	width: 11px;
	height: 11px;
	margin: 2px;
	transform: ${({clicked}) => (clicked) ? 'translateX(-34px)' : 'translateX(-16px)'}
`;

const DisturbTimeButton_Input = styled.TextInput.attrs({maxLength: 2,})`
	color: black;
    font-size: 8px;
	font-weight: normal;
	width: 50px;
  	height: 40px;
	text-align: center;
`;

const ResultButton = styled.TouchableOpacity`
	width: 300px;
	height: 40px;
	background-color: #FF7154;
	border-radius: 15px;
	margin: 50px;
	margin-bottom: 80px;
`;

const ResultButton_Text = styled.Text`
	color: white;
    font-size: 10px;
	font-weight: bold;
    font-family: Pretendard;
	text-align: center;
	margin: 13px;
`;

const ThemeContainer = styled.View`
	width: 300px;
	height: 50px;
	display: flex;
  	justify-content: center;
	flex-direction: row;
`;

const Theme = styled.TouchableOpacity`
	width: 40px;
	height: 40px;
	border-radius: 100px;
	
`;

//시발 테마 어케만드는데
export default Register;