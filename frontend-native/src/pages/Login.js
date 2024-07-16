/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/self-closing-comp */

import React, { useEffect, useRef } from 'react';
import { View, Text, Button, TouchableOpacity, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled, { ThemeProvider } from "styled-components/native"
import images from "../components/images";

function Login({}) {
	const navigation = useNavigation();

	return (
		<FullView>
			<MainView>
				<Noti source={images.noti_intro} />
				<MainText style={{margin: 20, marginTop: 130}}>스마트한 시간 관리, 효율적인 삶의 시작</MainText>
				<MainText style={{fontSize: 60, marginBottom: 40}}>N  O  T  I</MainText>
				<TextContainer>
					<MainTextBlack>일정에 </MainTextBlack>
					<MainText>편리함</MainText>
					<MainTextBlack>을 더하다</MainTextBlack>
				</TextContainer>
				<TextContainer>
					<MainTextBlack>일상에</MainTextBlack>
					<MainText>노티</MainText>
					<MainTextBlack>를 더하다</MainTextBlack>
				</TextContainer>
				
				<KakaoBox onPress={() => navigation.navigate('kakaoLogin', { nextScreen: 'Todo' })}>
					<Box>
						<Kakao source={images.Kakao} />
					<MainTextBlack style={{marginLeft: 20, fontSize: 14}}>KaKao로 시작하기</MainTextBlack>
					</Box>
				</KakaoBox>
				<RegisterText onPress={() => navigation.navigate('kakaoLogin', { nextScreen: 'Register' })}>회원가입</RegisterText>
			</MainView>
		</FullView>
	);
}

const FullView = styled.View`
	width: 100%;
	height: 100%;
	background-color: white;
	align-items: center;
`;

const MainView = styled(FullView)`
	align-self: center;
	justify-content: center;
`;

const Noti = styled.Image`
	width: 100%;
	height:40%;
	position: absolute;
	top: 0;
`;

const MainText = styled.Text`
    font-size: 12px;
    font-weight: 900;
    color: ${props => props.color || "#4059AD"};
    text-align: center;
`;

const MainTextBlack = styled(MainText)`
	color: black;
`;

const TextContainer = styled.View`
	align-items: center;
	align-self: center;
	flex-direction: row;
	margin-top: 20px;
`;

const KakaoBox = styled.TouchableOpacity`
	width: 75%;
	height: 50px;
	background-color: #FDDC3F;
	border-radius: 40px;
	position: absolute;
	bottom: 80px;
	justify-content: center;
`;

const Box = styled.View`
	flex-direction: row;
	align-self: center;
	align-items: center;
`;

const Kakao = styled.Image`
	width: 45px;
	height: 45px;
	align-self: center;
`;

const RegisterText = styled.Text`
	font-size: 15px;
	color: #B7BABF;
	position: absolute;
	bottom: 40px;
`;

export default Login;