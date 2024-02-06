/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */

import React, { useState } from 'react';
import { ScrollView } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import { useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

import DateTimePickerModal from "react-native-modal-datetime-picker";
import images from "../components/images";
import theme from "../components/theme";

function Register() {
    const navigation = useNavigation();
    const email = "streethong@naver.com";

    const [selectedTheme, setSelectedTheme] = useState(theme.OrangeTheme);

    const [Buttonclicked, setButtonClicked] = useState(false);
    const [inputName, setInputName] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedStartTime, setSelectedStartTime] = useState('');
    const [selectedEndTime, setSelectedEndTime] = useState('');
    const [selectedDiaryTime, setSelectedDiaryTime] = useState('');
    const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
    const [isDiaryTimePickerVisible, setDiaryTimePickerVisible] = useState(false);

    const showDatePicker = (type) => {
        switch (type) {
            case 'startTime':
                setStartTimePickerVisible(true);
                break;
            case 'endTime':
                setEndTimePickerVisible(true);
                break;
            case 'diary':
                setDiaryTimePickerVisible(true);
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
            case 'diary':
                setSelectedDiaryTime(formattedTime);
                break;
            default:
                break;
        }

        hideDatePicker();
    };

    return (
        <ThemeProvider theme={selectedTheme}>
            <ScrollView>
                <FullView>
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
                            <InputName
                                placeholder="닉네임(한글 6자 이내/특수문자 입력 불가)"
                                value={inputName}
                                onChangeText={(text) => setInputName(text)}
                            />
                        </TextBox>

                        <RegularText>이메일</RegularText>
                        <TextBox color="#D5D5D5">
                            <TextBoxText>{email}</TextBoxText>
                        </TextBox>

                        <HorisontalView>
                            <RegularText>방해 금지 시간</RegularText>
                            <HorisontalViewEnd>
                                <DisturbTimeButton
                                    thumbColor="#FFFF"
                                    onValueChange={() => setButtonClicked(prevState => !prevState)}
                                    value={Buttonclicked}
                                />
                            </HorisontalViewEnd>
                        </HorisontalView>

                        {Buttonclicked && (
                            <>
                                <HorisontalView>
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
                                </HorisontalView>

                                <HorisontalView>
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
                                </HorisontalView>
                            </>
                        )}

                        <RegularText>일기 생성 시간 *</RegularText>
                        <TimeSelectionTextBox onPress={() => showDatePicker('diary')}>
							<Time>{selectedDiaryTime}</Time>
							<DateTimePickerModal
                                isVisible={isDiaryTimePickerVisible}
                                mode="time"
                                onConfirm={(date) => handleTimePickerConfirm('diary', date)}
                                onCancel={hideDatePicker}
                            />
                        </TimeSelectionTextBox>

                        <RegularText>테마 선택</RegularText>
                        <HorisontalView>
                            {Object.keys(theme).map(themeKey => (
                                <ThemedButton
                                    key={themeKey}
                                    style={{ backgroundColor: theme[themeKey].color1 }}
                                    onPress={() => setSelectedTheme(theme[themeKey])}
                                />
                            ))}
                        </HorisontalView>

                        <ResultButton onPress={() => navigation.navigate("Register_Success", { currentTheme: selectedTheme })}>
                            <RegularText color="white">완료</RegularText>
                        </ResultButton>

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

const HorisontalViewEnd = styled(HorisontalView)`
    justify-content: flex-end;
`;

const MainText = styled.Text`
    color: ${props => props.color || "black"};
    font-size: 15px;
    font-weight: bold;
    text-align: center;
    margin: 20px;
`;

const RegularText = styled(MainText)`
    font-size: 8px;
    text-align: left;
    margin: 0px;
    margin-top: 20px;
`;

const TextBoxText = styled(MainText)`
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

const Images = styled.Image`
    width: ${props => props.size || "100px"};
    height: ${props => props.size || "100px"};
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

const InputName = styled.TextInput.attrs({ maxLength: 6 })`
    color: black;
    font-size: 8px;
    font-weight: normal;
    width: 100%;
    height: 100%;
    margin-left: 10px;
`;

const DisturbTimeButton = styled.Switch.attrs(props => ({
    trackColor: {
        false: '#F2F3F5',
        true: props.theme.color1,
    },
}))`
    margin-top: 10px;
`;

const TimeSelectionTextBox = styled(TextBox)`
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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
    margin-top: 30px;
    margin-bottom: 0px;
    justify-content: center;
    align-items: center;
`;

export default Register;
