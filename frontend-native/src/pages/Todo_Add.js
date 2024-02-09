/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */

import styled, { ThemeProvider } from "styled-components/native";

import React, { useState } from 'react';
import { Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import images from "../components/images";
import theme from "../components/theme";

function Todo_Add({ }) {
    const navigation = useNavigation();
    const route = useRoute();
    const { selectedTheme } = route.params;
    
    const color_sheet = [selectedTheme.color1, selectedTheme.color2, selectedTheme.color3, selectedTheme.color4, selectedTheme.color5];
    
    const [isSelectedTheme, setSelectedTheme] = useState(theme.OrangeTheme);
    const [inputTitle, setInputTitle] = useState('');
    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
    
    const showDatePicker = (type) => {
        switch (type) {
            case 'startTime':
                setStartTimePickerVisible(true);
                break;
            case 'endTime':
                setEndTimePickerVisible(true);
                break;
            default:
                break;
        }
    };
    
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    
    const handleTimePickerConfirm = (type, date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const formattedTime = `${hours}:${minutes}`;

        switch (type) {
            case 'startTime':
                setSelectedStartTime(formattedTime);
                break;
            case 'endTime':
                setSelectedEndTime(formattedTime);
                break;
            default:
                break;
        }
        hideDatePicker();
    };

    return (
        <ThemeProvider theme={selectedTheme}>
            <FullView>
                <MainView>
                    <MainText>노티 제목</MainText>
                    <TextBox>
                        <InputBox
                            placeholder="노티 제목을 입력해주세요(한글 15자 이내)"
                            value={inputTitle}
                            onChangeText={(text) => setInputTitle(text)}
                        />
                    </TextBox>

                    <MainText>노티 시간</MainText>
                    <TextBox onPress={() => showDatePicker('startTime')}>
                        <TextBoxText>시작 시간</TextBoxText>
                        <Time>{selectedStartTime}</Time>
                    </TextBox>
                    <DateTimePickerModal
                        isVisible={isStartTimePickerVisible}
                        mode="time"
                        onConfirm={(date) => handleTimePickerConfirm('startTime', date)}
                        onCancel={hideDatePicker}
                    />
                    <TextBox onPress={() => showDatePicker('endTime')}>
                        <TextBoxText>종료 시간</TextBoxText>
                        <Time>{selectedEndTime}</Time>
                    </TextBox>
                    <DateTimePickerModal
                        isVisible={isEndTimePickerVisible}
                        mode="time"
                        onConfirm={(date) => handleTimePickerConfirm('endTime', date)}
                        onCancel={hideDatePicker}
                    />

                    <MainText>노티 색상</MainText>
                    <HorisontalView>
                        {[1, 2, 3, 4, 5].map(index => (
                            <ThemedButton
                                key={index}
                                style={{ backgroundColor: color_sheet[index - 1] }}
                                onPress={() => setSelectedTheme(selectedTheme[`color${index}`])}
                            />
                        ))}
                    </HorisontalView>

                    <ResultButton onPress={() => navigation.navigate("Todo", { currentTheme: selectedTheme })}>
                        <MainText color="white">완료</MainText>
                    </ResultButton>
                </MainView>
            </FullView>
        </ThemeProvider>
    );
}

const FullView = styled.View`
    flex: 1;
    align-items: center;
    background-color: white;
`;

const MainView = styled.View`
    align-items: stretch;
    width: 300px;
`;

const HorisontalView = styled.View`
    flex-direction: row;
	justify-content: center;
`;

const MainText = styled.Text`
    font-size: 13px;
    font-weight: bold;
    color: ${props => props.color || "black"};
    text-align: left;
    margin-top: 40px;
`;

const TextBox = styled.TouchableOpacity`
    width: 300px;
    height: 40px;
    border-radius: 15px;
    margin-top: 10px;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    background-color: ${props => props.color || "#F2F3F5"};
`;

const InputBox = styled.TextInput.attrs({ maxLength: 15 })`
    color: black;
    font-size: 8px;
    font-weight: normal;
    width: 100%;
    height: 100%;
    margin-left: 10px;
`;

const TextBoxText = styled.Text`
    font-size: 8px;
    text-align: left;
    font-weight: normal;
    margin: 0px;
    margin-left: 10px;
`;

const Time = styled(TextBoxText)`
    text-align: right;
    margin-right: 10px;
`;

const ThemedButton = styled.TouchableOpacity`
    height: 30px;
    width: 30px;
    padding: 15px;
    margin: 10px;
    border-radius: 100px;
    justify-content: center;
    align-items: center;
    background-color: ${props => props.style.backgroundColor};
`;

const ResultButton = styled(TextBox)`
    background-color: ${props => props.theme.color1};
    margin-top: 50px;
    justify-content: center;
    align-items: center;
    align-self: stretch;
`;

export default Todo_Add;
