/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */

import styled, { ThemeProvider } from 'styled-components/native';
import React, { useState, useEffect, } from 'react';
import { TouchableOpacity, Text } from "react-native";
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

    const currentDate = new Date();
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const dayOfWeek = daysOfWeek[currentDate.getDay()];
    const formattedDate = `${currentDate.getMonth() + 1}월 ${currentDate.getDate()}일 ${dayOfWeek}요일`;

	const [clicked_add, setCliecked_add] = useState(false);
	const [clicked_frame, setCliecked_frame] = useState(false);
	const [clickd_pin, setClicked_pin] = useState(false);
	const [clicked_out, setClicked_out] = useState(false);
	const [clicked_calendar, setClicked_calendar] = useState(false);
	const [clicked_share, setClicked_share] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);

    return (
        <ThemeProvider theme={selectedTheme}>
            <MainViewStyle>
                <ProfileContainer>
                    <Profile source={images.profile} />
                    <ProfileTextContainer>
                        <MainText>
                            {name} 님,
                        </MainText>
                        <MainText color={selectedTheme.color1}>
                            {formattedDate} 노티입니다!
                        </MainText>
                    </ProfileTextContainer>
                </ProfileContainer>

                <BarContainer>
					<MainText onPress={() => navigation.navigate("Todo", { selectedTheme })} color="#B7BABF"> 나의 일정      </MainText>
                    <MainText>      협업 일정</MainText>
                </BarContainer>

                <Bar />
				<Bar_Mini />
				
				<Icons>
					<images.team_add width={20} height={20}
						color={clicked_add ? color_sheet[0] : "#B7BABF"}
						onPress={() => setCliecked_add(!clicked_add)} />
				</Icons>
				

            </MainViewStyle>
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

const HorisontalView_End = styled(HorisontalView)`
	justify-content: flex-end;
`;

const MainViewStyle = styled.View`
    flex: 1;
    display: flex;
    background-color: white;
`;

const ProfileContainer = styled.View`
    display: flex;
    flex-direction: row;
`;

const BarContainer = styled(ProfileContainer)`
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`;

const ProfileTextContainer = styled(ProfileContainer)`
    flex-direction: column;
    margin-top: 25px;
    margin-left: 10px;
`;

const Profile = styled.Image`
    width: 40px;
    height: 40px;
    margin-top: 20px;
    margin-left: 50px;
`;

const MainText = styled.Text`
    font-size: 12px;
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

const Icons = styled.View`
	display: flex;
	flex-direction: row;
	margin-left: 70px;
	margin-top: 15px;
`;


export default Coop_Main;
