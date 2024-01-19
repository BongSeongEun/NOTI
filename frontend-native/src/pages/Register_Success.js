/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */

import styled from "styled-components/native"

import React from 'react';
import {
	ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import images from "../components/images";

function Register_Success({ }) {
	const navigation = useNavigation();
	const name = "홍길동";

	return (
		<ScrollView>
			<MainViewStyle>
				<RegularText>
					프로필 생성 완료!
				</RegularText>

				<MainText>
					{name} 님! 노티에 {'\n'} 오신것을 환영해요
				</MainText>

				<ProfileContainer>
					<Profile source={images.Profile_g}></Profile>
					<Deco source={images.Deco}></Deco>
				</ProfileContainer>

				<ResultButton onPress={() => navigation.navigate("Todo")}>
					<ResultText>완료</ResultText>
				</ResultButton>

			</MainViewStyle>
		</ScrollView>
	);
}

const MainViewStyle = styled.View`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
  	background-color: #333333;
`;

const Profile = styled.Image`
  	width: 130px;
  	height: 130px;
	margin-top: 50px;
`;

const Deco = styled.Image`
  	width: 180px;
  	height: 150px;
  	position: absolute;
  	margin-top: 45px;
	margin-left: -40px;
`;

const ProfileContainer = styled.View`
  	position: relative;
	display: flex;
`;

const MainText = styled.Text`
	color: white;
	font-size: 20px;
	font-weight: bold;
	margin: 20px;
	text-align: center;
`;

const RegularText = styled.Text`
	color: #FF7154;
	font-size: 15px;
	font-weight: bold;
	margin-top: 50px;
`;

const ResultText = styled.Text`
	color: white;
    font-size: 10px;
	font-weight: bold;
    font-family: Pretendard;
	text-align: center;
	margin: 13px;
`;

const ResultButton = styled.TouchableOpacity`
	width: 300px;
	height: 40px;
	background-color: #FF7154;
	border-radius: 15px;
	margin: 50px;
	margin-bottom: 80px;
	margin-top: 137px;
	justify-content: center;
  	align-items: center;
	display: flex;
`; 

export default Register_Success;