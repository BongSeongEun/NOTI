/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import React, { useState } from 'react';
import {
	Text,
	ScrollView,
	Switch,
} from "react-native";

import styled, { ThemeProvider } from "styled-components";
import { useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import images from "../components/images";
import theme from "../components/theme";

function Register({ }) {
	const navigation = useNavigation();
	const email = "streethong@naver.com";

	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
	const handleThemeChange = selectedTheme => {
		setCurrentTheme(selectedTheme);
	};

	const [inputName, setInput_name] = useState("");
	const [inputSDNum1, setInput_SDNum1] = useState("");
	const [inputSDNum2, setInput_SDNum2] = useState("");
	const [inputEDNum1, setInput_EDNum1] = useState("");
	const [inputEDNum2, setInput_EDNum2] = useState("");

	const [Buttonclicked, setButtonClicked] = useState(false);

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView>
				<ScrollView>

					<MainView>
						<MainText>가입을 축하드려요! {'\n'} 프로필을 등록해보세요</MainText>

						<HorisontalView>
							<Images source={images.profile} />
							<GalleryButton>
								<Images source={images.gallery} size="20px" />
							</GalleryButton>
						</HorisontalView>

						<RegularText>사용자 이름 *</RegularText>
						<TextBox>
							<Input_Name
								placeholder="닉네임(한글 6자 이내/특수문자 입력 불가)"
								value={inputName}
								onChangeText={(text) => setInput_name(text)}
							/>
						</TextBox>

						<RegularText>이메일</RegularText>
						<TextBox color="#D5D5D5">
							<TextBoxText>{email}</TextBoxText>
						</TextBox>

						<HorisontalView>
							<RegularText>방해 금지 시간</RegularText>
							<HorisontalView_End>
								<DisturbTimeButton
									trackColor={{ false: '#F2F3F5', true: '#FF7154' }}
									thumbColor="#FFFF"
									onValueChange={() => setButtonClicked(previousState => !previousState)}
									value={Buttonclicked}
								/>
							</HorisontalView_End>		
						</HorisontalView>

						<TextBox>
							<TextBoxText>시작 시간</TextBoxText>
						</TextBox>
							
					
					</MainView>

				</ScrollView>
			</FullView>
		</ThemeProvider>
	);
}

const FullView = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: white;
`;

const MainView = styled(FullView)`
	width: 300px;
	height: auto;
	align-items: stretch;
`;

const HorisontalView = styled(FullView)`
	flex-direction: row;
	margin-top: auto;
`;

const HorisontalView_End = styled(HorisontalView)`
	justify-content: flex-end;
`;



const MainText = styled.Text`
	color: black;
	font-size: 15px;
	font-weight: bold;
	text-align: center;
	margin: 20px;
`;

const RegularText = styled(MainText)`
	font-size: 8px;
	font-weight: bold;
	text-align: left;
	margin: 0px;
	margin-top: 20px;
`;

const TextBoxText = styled(RegularText)`
	font-weight: normal;
	margin: 0px;
	margin-left: 10px;
`;




const Images = styled.Image`
	width: ${props => props.size || "100px" };
	height: ${props => props.size || "100px" };
`;

const GalleryButton = styled.TouchableOpacity`
	width: 40px;
	height: 40px;
	background-color: ${props => props.theme.color1};
	border-radius: 100px;
	justify-content: center;
	align-items: center;
	margin-left: -30px;
	margin-top: 55px;
`;




const TextBox = styled.TouchableOpacity`
	background-color: ${props => props.color || "#F2F3F5"};
	width: 300px;
	height: 40px;
	border-radius: 15px;
	margin-top: 10px;
	justify-content: center;
`;

const Input_Name = styled.TextInput.attrs({maxLength: 6})`
	color: black;
    font-size: 8px;
	font-weight: normal;
	width: 100%;
  	height: 100%;
	margin-left: 10px;
`;




const DisturbTimeButton = styled.Switch`
	margin-top: 20px;
`;

const Input_DisturbTime = styled.TextInput.attrs({maxLength: 2})`
	color: black;
    font-size: 8px;
	font-weight: normal;
	width: 50px;
  	height: 40px;
	text-align: left;
`;




const ThemedButton = styled.TouchableOpacity`
	height: 30px;
	width: 30px;
	padding: 15px;
	margin: 15px;
	border: none;
	border-radius: 100px;
	background-color: ${props => props.theme.color1};
`;




const ResultButton = styled(TextBox)`
	background-color: ${props => props.theme.color1};
	margin-top: 30px;
	margin-bottom: 0px;
`;

export default Register;