/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */

import styled, { ThemeProvider } from 'styled-components/native';
import React, { useState, useEffect } from 'react';
import { ScrollView, Modal, Text, TouchableOpacity, } from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import { theme } from "../components/theme";
import images from "../components/images";
import { TextInput } from 'react-native-gesture-handler';

function Coop_Main() {
    const navigation = useNavigation();
    const route = useRoute();
	const { selectedTheme } = route.params;

	const color_sheet = [selectedTheme.color1, selectedTheme.color2, selectedTheme.color3, selectedTheme.color4, selectedTheme.color5];
	const name = "홍길동";
	const team_name = ['졸업작품 팀 프로젝트', '뭔지 모르겠는 프로젝트', '암튼 팀 프로젝트'];
	const team_todo = ['유산소 운동', '강아지 산책', '스터디' ];

    const currentDate = new Date();
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 ${dayOfWeek}요일`;

	const [clicked_add, setClicked_add] = useState(false);
	const [clicked_frame, setCliecked_frame] = useState(false);
	const [clicked_out, setClicked_out] = useState(false);
	const [clicked_check, setClicked_check] = useState(Array(5).fill(false));
	const [modalVisible, setModalVisible] = useState(false);
	const [inputTeamLink, setInputTeamLink] = useState('');
	const [clicked_pin, setClicked_pin] = useState(false);

    const TeamFrame = ({ teamName, clickedPin, setClickedPin, clickedOut, setClickedOut, colorSheet }) => (
		<TeamFrameContainer>
			<images.team_frame color={clickedPin ? colorSheet[0] : "#B7BABF"} style={{ position: 'absolute' }} />
			<images.team_pin
				width={15}
				height={15}
				color={clickedPin ? colorSheet[0] : "#B7BABF"}
				onPress={() => setClickedPin(!clickedPin)}
				style={{ position: 'absolute', margin: 15, left: 10 }}
			/>
			
			<MainText style={{ position: 'absolute', margin: 15, alignSelf: 'center' }}>{teamName}</MainText>
			
			<NotiContainer>
				<>
					{Noties(0, clickedPin, colorSheet)}
					{Noties(1, clickedPin, colorSheet)}
				</>
			</NotiContainer>
			
			<images.team_out
				width={15}
				height={15}
				color={clickedOut ? colorSheet[0] : "#B7BABF"}
				onPress={() => setClickedOut(!clickedOut)}
				style={{ position: 'absolute', margin: 15, right: 10 }}
			/>
		</TeamFrameContainer>
	);

	const Noties = (colorNum, clickedPin, colorSheet) => (
		<Team_Noti color={clickedPin ? `${colorSheet[colorNum]}` : colorSheet[colorNum]}>
			<NotiCheck onPress={() => setClicked_check(!clicked_check)}>
				<images.noticheck width={15} height={15} color={clicked_check ? `${colorSheet[colorNum]}` : "#B7BABF"} />
			</NotiCheck>
			<NotiText>{team_todo[colorNum]}</NotiText>
		</Team_Noti>
	);	  

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
						<images.team_add
							width={20}
							height={20}
							color={clicked_add ? color_sheet[0] : "#B7BABF"}
							onPress={() => {
								setClicked_add(!clicked_add);
								setModalVisible(true);
							}}
							style={{ margin: 10, alignSelf: 'flex-end' }}
						/>
				
						<TeamFrame
							teamName={team_name[0]}
							clickedPin={clicked_pin[0]}
							setClickedPin={(value) => setClicked_pin([value, clicked_pin[1], clicked_pin[2]])}
							clickedOut={clicked_out[0]}
							setClickedOut={(value) => setClicked_out([value, clicked_out[1], clicked_out[2]])}
							colorSheet={color_sheet}
						/>

						<TeamFrame
							teamName={team_name[1]}
							clickedPin={clicked_pin[1]}
							setClickedPin={(value) => setClicked_pin([clicked_pin[0], value, clicked_pin[2]])}
							clickedOut={clicked_out[1]}
							setClickedOut={(value) => setClicked_out([clicked_out[0], value, clicked_out[2]])}
							colorSheet={color_sheet}
						/>

						<Modal
							animationType="slide"
							transparent={true}
							visible={modalVisible}
							onRequestClose={() => setModalVisible(false)}>
							<ModalContainer>
								<ModalView>
									<MainText style={{ margin: 20, fontSize: 15 }}>팀 추가하기</MainText>

									<TouchableOpacity style={{
										width: 300, height: 40,
										backgroundColor: "#F2F3F5",
										borderRadius: 15,
										flexDirection: 'row',
										justiftContent: 'center',
										alignItems: 'center',
										marginBottom: 20,
									}}>
										<images.team_search width={15} height={15}
											style={{ margin: 10 }} />
										<TextInput
											placeholder="팀 협업 링크 또는 태그 입력"
											value={inputTeamLink}
											onChangeText={(text) => setInputTeamLink(text)}
											style={{fontSize: 10}}
										/>
									</TouchableOpacity>

									<TouchableOpacity onPress={() => {
										setModalVisible(!modalVisible);
										setClicked_add(false);
									}}>
									<Text>닫기</Text>
								</TouchableOpacity>
								</ModalView>
							</ModalContainer>
						</Modal>

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
	margin-bottom: 10px;
`;

const Team_Noti = styled.TouchableOpacity`
	width: 230px;
	height: 30px;
	border-radius: 15px;
	background-color: ${props => props.color || "#FF7154"};
	flex-direction: row;
	align-items: center;
	margin: 5px;
`;

const NotiCheck = styled.TouchableOpacity`
	width: 20px;
	height: 20px;
	border-radius: 100px;
	background-color: white;
	margin-left: 10px;
	justify-content: center;
	align-items: center;
`;

const NotiText = styled.Text`
	font-size: 10px;
	font-weight: normal;
	color: ${props => props.color || "white"};
	text-align: left;
	margin-left: 10px;
`;

const NotiContainer = styled.View`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 40px;
`;



const ModalContainer = styled.View`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.5);
    justify-content: flex-end;
    align-items: center;
`;

const ModalView = styled.View`
    background-color: white;
	border-top-left-radius: 20px;
	border-top-right-radius: 20px
	width: 100%;
	height: 250px;
    align-items: center;
`;


export default Coop_Main;
