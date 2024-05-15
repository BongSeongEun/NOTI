/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/self-closing-comp */

import React from 'react';
import { View, Text, Button, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styled, { ThemeProvider } from "styled-components/native"
import images from "../components/images";

function Login({}) {
  const navigation = useNavigation();

	return (
		<FullView>
			<MainView>
				<Noti source={images.Noti} />
				<MainText>노티와 함께 만드는 유쾌한 하루</MainText>
				<TouchableOpacity onPress={() => navigation.navigate('kakaoLogin', { nextScreen: 'Todo' })}>
					<Kakao source={images.Kakao} />
				</TouchableOpacity>
				<Text
					onPress={() => navigation.navigate('kakaoLogin', { nextScreen: 'Register' })}
					style={{ fontSize: 15, alignSelf: 'center', color: '#B7BABF', margin: 15 }}
				>
					회원가입
				</Text>
			</MainView>
		</FullView>
	);
}

const FullView = styled.View`
	width: 100%;
	height: 100%;
	background-color: white;
	align-self: center;
	justify-content: center;
`;

const MainView = styled(FullView)`
	align-self: center;
	justify-content: center;
`;

const Noti = styled.Image`
	width: 150px;
	height: 200px;
	align-self: center;
`;

const MainText = styled.Text`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.color || "black"};
    text-align: center;
`;

const Kakao = styled.Image`
	width: 50px;
	height: 50px;
	align-self: center;
	margin-top: 60px;
`;

export default Login;