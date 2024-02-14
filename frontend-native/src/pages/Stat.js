/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import styled, { ThemeProvider } from 'styled-components/native';
import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, Text, TouchableOpacity, } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import { theme } from "../components/theme";
import images from "../components/images";
import { TextInput } from 'react-native-gesture-handler';
import Navigation_Bar from "../components/Navigation_Bar";
import {ProgressChart, } from "react-native-chart-kit";


function Stat({ }) {
	const navigation = useNavigation();
	const route = useRoute();
	const { selectedTheme } = route.params;
	const color_sheet = [selectedTheme.color1, selectedTheme.color2, selectedTheme.color3, selectedTheme.color4, selectedTheme.color5];
	const name = "홍길동";
    const currentDate = new Date();
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 ${dayOfWeek}요일`;
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
			  
			  <FullView style={{ flex: 1 }}>
				  <Bar />
				  <ScrollView>
					  <MainView>
						  
					  </MainView>
				  </ScrollView>
				  <Navigation_Bar selectedTheme={selectedTheme} />
			  </FullView>
		  </ThemeProvider>
    );
}

const FullView = styled.View`
	width: 100%;
	background-color: white;
`;

const MainView = styled(FullView)`
	height: auto;
	align-items: stretch;
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
    margin-top: 10px;
    background-color: #B7BABF;
`;

export default Stat;