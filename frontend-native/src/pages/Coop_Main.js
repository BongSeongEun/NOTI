/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */

import styled, { ThemeProvider } from 'styled-components/native';
import React, { useState, useEffect, } from 'react';
import { ScrollView, } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import { theme } from "../components/theme";
import images from "../components/images";

function Coop_Main() {
    const navigation = useNavigation();
    const route = useRoute();
	const { selectedTheme } = route.params;

	const color_sheet = [selectedTheme.color1, selectedTheme.color2, selectedTheme.color3, selectedTheme.color4, selectedTheme.color5];
	const name = "홍길동";
	const team_name = ['졸업작품 팀 프로젝트', '뭔지 모르겠는 프로젝트', '암튼 팀 프로젝트'];
	const team_todo = ['유산소 운동', '강아지 산책'];

    const currentDate = new Date();
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 ${dayOfWeek}요일`;

	const [clicked_add, setClicked_add] = useState(false);
	const [clicked_frame, setCliecked_frame] = useState(false);
	const [clicked_pin, setClicked_pin] = useState(false);
	const [clicked_out, setClicked_out] = useState(false);
	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

    return (
        <ThemeProvider theme={selectedTheme}>
			<ScrollView>
				<FullView>

					<MainView>
						<ProfileContainer>
							<Profile source={images.profile} style={{ marginTop: 20 }} />
							<ProfileTextContainer>
								<MainText>
									{name} 님,
								</MainText>
								<MainText color={color_sheet[0]}>
									{formattedDate} 노티입니다!
								</MainText>
							</ProfileTextContainer>
						</ProfileContainer>
					</MainView>

					<ProfileContainer>
						<MainText onPress={() => navigation.navigate('Todo', { selectedTheme: selectedTheme })}
							style={{ marginRight: 20 }}>나의 일정</MainText>
                        <MainText style={{ marginLeft: 20 }}>협업 일정</MainText>
                    </ProfileContainer>
					<Bar />
					<Bar_Mini />

					<MainView>
						<images.team_add width={20} height={20} color={clicked_add ? color_sheet[0] : "#B7BABF"} onPress={() => setClicked_add(!clicked_add)}
							style={{ margin: 10, alignSelf: 'flex-end' }} />
				
						<TeamFrameContainer>
							<images.team_frame color={clicked_pin ? color_sheet[0] : "#B7BABF"}
							style={{ position: 'absolute' }}/>
							<images.team_pin width={15} height={15} color={clicked_pin ? color_sheet[0] : "#B7BABF"} onPress={() => setClicked_pin(!clicked_pin)}
								style={{ position: 'absolute', margin: 15, left: 10 }} />
							
							<MainText style={{ position: 'absolute', margin: 15, alignSelf: 'center' }}>{team_name[0]}</MainText>


							<images.team_out width={15} height={15} color={clicked_out ? color_sheet[0] : "#B7BABF"} onPress={() => setClicked_out(!clicked_out)}
								style={{ position: 'absolute', margin: 15, right: 10 }} />
						</TeamFrameContainer>
					</MainView>

				</FullView>
			</ScrollView>
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
	align-items: stretch;
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
	margin-bottom: 25px;
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
    margin-top: 10px;
    background-color: #B7BABF;
`;

const Bar_Mini = styled(Bar)`
    align-self: flex-end;
    width: 50%;
    height: 2px;
    background-color: ${props => props.theme.color1};
    margin-top: -1px;
`;



const TeamFrameContainer = styled.View`
	position: relative;
	width: 300px;
	height: 150px;
`;

const Team_Noti = styled.TouchableOpacity`
	width: 250;
	height: 30;
`;

export default Coop_Main;
