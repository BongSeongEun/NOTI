/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-trailing-spaces */

import styled, { ThemeProvider } from "styled-components/native";

import React, { useState, useEffect } from 'react';
import {  } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import 'react-native-gesture-handler';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';

import images from "../components/images";
import theme from "../components/theme";

function Todo_Add({ }) {
	const navigation = useNavigation();
    const route = useRoute();
    const {
        todoId,
        inputTitle: initialInputTitle,
        selectedStartTime: initialSelectedStartTime,
        selectedEndTime: initialSelectedEndTime,
        selectedColor: initialSelectedColor,
        isEditing,
        selectedDate
    } = route.params || {};

    const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [inputTitle, setInputTitle] = useState(initialInputTitle || '');
    const [selectedStartTime, setSelectedStartTime] = useState(initialSelectedStartTime || '');
    const [selectedEndTime, setSelectedEndTime] = useState(initialSelectedEndTime || '');
    const [selectedColor, setSelectedColor] = useState(initialSelectedColor || '');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
	const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);

	useEffect(() => {
		if (isEditing) {
			setInputTitle(inputTitle);
			setSelectedStartTime(selectedStartTime);
			setSelectedEndTime(selectedEndTime);
			setSelectedColor(selectedColor);
		}
	}, [isEditing, inputTitle, selectedStartTime, selectedEndTime, selectedColor]);
    
	useEffect(() => {
        fetchUserData();
    }, []);

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
		let hours = date.getHours();
		let minutes = date.getMinutes();
	
		hours = hours < 10 ? `0${hours}` : hours;
		minutes = minutes < 10 ? `0${minutes}` : minutes;
	
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
	

	const getUserIdFromToken = async () => {
		try {
		  const token = await AsyncStorage.getItem('token');
		  const payload = token.split('.')[1];
		  const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
		  const decodedPayload = decode(base64);
		  const decodedJSON = JSON.parse(decodedPayload);
		  
		  return decodedJSON.id.toString();
		} catch (error) {
		  console.error('Error decoding token:', error);
		  return null;
		}
	};

	const fetchUserData = async () => { 
		const userId = await getUserIdFromToken();
		try {
			const userResponse = await axios.get(`http://15.164.151.130:4000/api/v1/userInfo/${userId}`, {
			  headers: {
				'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
			  },
			});
	  
			if (userResponse.status === 200) {
				const userThemeName = userResponse.data.userColor;
				if (theme[userThemeName]) {
					setCurrentTheme(theme[userThemeName]);
				}
			} else {
                console.error("Failed to fetch theme:", userResponse);
            }
        } catch (error) {
            console.error("Error fetching theme:", error);
        }
	};
	
	const handleSaveTodo = async () => {
		const userId = await getUserIdFromToken();
		const formattedSelectedDate = selectedDate.replace(/-/g, '.');
		
		const url = isEditing
			? `http://15.164.151.130:4000/api/v1/updateTodo/${userId}/${todoId}`
			: `http://15.164.151.130:4000/api/v1/createTodo/${userId}`;
		
		const method = isEditing ? 'put' : 'post';
		
		try {
			const response = await axios[method](url, {
				todoTitle: inputTitle,
				todoStartTime: selectedStartTime,
				todoEndTime: selectedEndTime,
				todoColor: selectedColor,
				todoDate: formattedSelectedDate,
			}, {
				headers: {
					'Authorization': `Bearer ${await AsyncStorage.getItem('token')}`,
				},
			});
			
			if (response.status === 200) {
				navigation.goBack();
			} else {
				console.error("Failed to save todo:", response);
			}
		} catch (error) {
			console.error("Error saving todo:", error);
		}
	};

    return (
        <ThemeProvider theme={currentTheme}>
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
						{Object.keys(currentTheme).filter(key => key.startsWith('color')).map((key, index) => (
							<ThemedButton
								key={key}
								style={{ backgroundColor: currentTheme[key] }}
								onPress={() => setSelectedColor(key)}
							/>
						))}
					</HorisontalView>

					<ResultButton onPress={() => { handleSaveTodo(); }} selectedColorKey={selectedColor}>
						<MainText style={{marginTop: 0}} color="white">완료</MainText>
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
    font-size: 10px;
    font-weight: normal;
    width: 100%;
    height: 100%;
    margin-left: 10px;
`;

const TextBoxText = styled.Text`
    font-size: 10px;
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
    background-color: ${props => props.theme[props.selectedColorKey] || props.theme.color1};
    margin-top: 50px;
    justify-content: center;
    align-items: center;
    align-self: stretch;
`;

export default Todo_Add;
