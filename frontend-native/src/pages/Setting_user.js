/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styled, { ThemeProvider } from 'styled-components/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { decode } from 'base-64';
import axios from 'axios';

import images from '../components/images';
import theme from '../components/theme';

const Setting_user = () => {
	const navigation = useNavigation();
	const [token, setToken] = useState(null);
	const [selectedTheme, setSelectedTheme] = useState(theme.OrangeTheme);
	const [Buttonclicked, setButtonClicked] = useState(false);
	const [inputName, setInputName] = useState("");
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const [selectedStartTime, setSelectedStartTime] = useState("");
	const [selectedEndTime, setSelectedEndTime] = useState("");
	const [selectedDiaryTime, setSelectedDiaryTime] = useState("");
	const [isStartTimePickerVisible, setStartTimePickerVisible] = useState(false);
	const [isEndTimePickerVisible, setEndTimePickerVisible] = useState(false);
	const [isDiaryTimePickerVisible, setDiaryTimePickerVisible] = useState(false);
	const [userEmail, setUserEmail] = useState("");
    const [userNickname, setUserNickname] = useState("");
    const [userTheme, setUserTheme] = useState("");
    const [userStartTime, setUserStartTime] = useState("");
    const [userEndTime, setUserEndTime] = useState("");
	const [userDiaryTime, setUserDiaryTime] = useState("");
	const [userProfileImage, setUserProfileImage] = useState(images.profile);

	useEffect(() => {
		const fetchAndDecodeToken = async () => {
			try {
				const storedToken = await AsyncStorage.getItem('token');
				setToken(storedToken);
			} catch (error) {
				console.error('Error fetching token:', error);
			}
		};
		fetchAndDecodeToken();
	}, []);
	
	const prepareImageDataForServer = (imageData, imageType = 'jpeg') => {
		const prefix = `data:image/${imageType};base64,`;
		return `${prefix}${imageData}`;
	};

	const getUserIdFromToken = (token) => {
		if (!token) {
			return null;
		}
		try {
			const actualToken = token || '';
			const payload = actualToken.split('.')[1];
			const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
			const decodedPayload = decode(base64);
			const decodedJSON = JSON.parse(decodedPayload);
		
			return decodedJSON.id.toString();
		} catch (error) {
			console.error('Error decoding token:', error);
			return null;
		}
	};
	  

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
			case 'diary':
				setSelectedDiaryTime(formattedTime);
				break;
			default:
				break;
		}
	
		hideDatePicker();
	};
	
	useEffect(() => {
		const fetchAndSetUserData = async () => {
			try {
				const storedToken = await AsyncStorage.getItem('token');
				setToken(storedToken);
	
				if (!storedToken) {
					console.log('Token not found');
					return;
				}
	
				const userId = getUserIdFromToken(storedToken);
				
				const userInfoResponse = await axios.get(`http://15.164.151.130:4000/api/v1/userInfo/${userId}`, {
					headers: {
						'Authorization': `Bearer ${storedToken}`,
					},
				});
				
				const userData = userInfoResponse.data;
				setUserEmail(userData.kakaoEmail);
				setUserNickname(userData.userNickname);
				setInputName(userData.userNickname); // 초기값 설정
				setUserTheme(userData.userColor);
				setSelectedTheme(userData.userColor); // 초기값 설정
				setUserDiaryTime(userData.diaryTime);
				setSelectedDiaryTime(userData.diaryTime); // 초기값 설정
				setUserStartTime(userData.muteStartTime);
				setSelectedStartTime(userData.muteStartTime); // 초기값 설정
				setUserEndTime(userData.muteEndTime);
				setSelectedEndTime(userData.muteEndTime); // 초기값 설정
				if (userData.userProfile) {
					setUserProfileImage({ uri: userData.userProfile });
				} else {
					setUserProfileImage(images.profile);
				}
			} catch (error) {
				console.error('Error fetching user info:', error);
			}
		};
		fetchAndSetUserData();
	}, []);

	const postUser = async () => {
		try {
			const storedToken = await AsyncStorage.getItem('token');
		
			if (!storedToken) {
				console.log('Token not found');
				return;
			}
		
			const userId = getUserIdFromToken(storedToken);
			const preparedImageData = imageFile ? prepareImageDataForServer(imageFile) : null;
		
			const userPayload = {
				userNickname: inputName || userNickname,
				userColor: selectedTheme || userTheme,
				diaryTime: selectedDiaryTime || userDiaryTime,
				muteStartTime: selectedStartTime || userStartTime,
				muteEndTime: selectedEndTime || userEndTime,
			};

			if (preparedImageData) {
				userPayload.userProfile = preparedImageData;
			}

			const response = await axios.put(`http://15.164.151.130:4000/api/v1/user/${userId}`, userPayload, {
				headers: {
					'Authorization': `Bearer ${storedToken}`,
				},
			});
		
			if (response.status === 200 || response.status === 201) {
				await AsyncStorage.setItem('userTheme', String(selectedTheme));
				navigation.navigate('Setting', { currentTheme: selectedTheme });
			}
		} catch (error) {
			console.error('Error posting user data:', error);
		}
	};

	const [response, setResponse] = useState("");
	const [imageFile, setImageFile] = useState("");

	const onSelectImage = () => {
		launchImageLibrary({
			mediaType: 'photo',
			maxWidth: 512,
			maxHeight: 512,
			includeBase64: true,
		}, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else if (response.assets) {
				const source = { uri: `data:image/jpeg;base64,${response.assets[0].base64}` };
				setUserProfileImage(source);
				setImageFile(response.assets[0].base64);
			}
		});
	};

	const handleSubmit = async () => {
		try {
			await postUser();
			await AsyncStorage.setItem('userColor', selectedTheme);
		} catch (error) {
			console.error('사용자 정보 전송 또는 AsyncStorage 저장 중 오류가 발생했습니다:', error);
		}
	};


	const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);

	const handleThemeChange = selectedThemeName => {
		const newTheme = theme[selectedThemeName];
		if (newTheme) {
			setCurrentTheme(newTheme);
			setSelectedTheme(selectedThemeName);
		} else {
			console.error("Selected theme does not exist:", selectedThemeName);
		}
	};

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView>
				<ScrollView>
					<MainView>
						<MainText>회원 정보 수정</MainText>
						<HorisontalView>
							<Images
								source={userProfileImage}
								style={{ width: 100, height: 100, borderRadius: 100 }}
							/>
							<GalleryButton onPress={() => onSelectImage()}>
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
							<TextBoxText>{userEmail}</TextBoxText>
						</TextBox>

						<HorisontalView style={{ justifyContent: 'space-between' }}>
							<RegularText>방해 금지 시간</RegularText>
							<DisturbTimeButton
								thumbColor="#FFFF"
								onValueChange={() => setButtonClicked((prevState) => !prevState)}
								value={Buttonclicked}
							/>
						</HorisontalView>

						{Buttonclicked && (
							<>
								<TextBox
									onPress={() => showDatePicker('startTime')}
									style={{ flexDirection: 'row' }}
								>
									<TextBoxText>시작 시간</TextBoxText>
									<Time>{selectedStartTime || userStartTime}</Time>
								</TextBox>
								<DateTimePickerModal
									isVisible={isStartTimePickerVisible}
									mode="time"
									onConfirm={(date) => handleTimePickerConfirm('startTime', date)}
									onCancel={hideDatePicker}
								/>

								<TextBox onPress={() => showDatePicker('endTime')}>
									<TextBoxText>종료 시간</TextBoxText>
									<Time>{selectedEndTime || userEndTime}</Time>
								</TextBox>
								<DateTimePickerModal
									isVisible={isEndTimePickerVisible}
									mode="time"
									onConfirm={(date) => handleTimePickerConfirm('endTime', date)}
									onCancel={hideDatePicker}
								/>
							</>
						)}

						<RegularText>일기 생성 시간 *</RegularText>
						<TextBox onPress={() => showDatePicker('diary')}>
							<Time>{selectedDiaryTime || userDiaryTime}</Time>
							<DateTimePickerModal
								isVisible={isDiaryTimePickerVisible}
								mode="time"
								onConfirm={(date) => handleTimePickerConfirm('diary', date)}
								onCancel={hideDatePicker}
							/>
						</TextBox>

						<RegularText>테마 선택</RegularText>
						<HorisontalView>
							<ThemedButton
								style={{ backgroundColor: theme.OrangeTheme.color1 }}
								onPress={() => handleThemeChange("OrangeTheme")}
							></ThemedButton>
							<ThemedButton
								style={{ backgroundColor: theme.RedTheme.color1 }}
								onPress={() => handleThemeChange("RedTheme")}
							></ThemedButton>
							<ThemedButton
								style={{ backgroundColor: theme.PinkTheme.color1 }}
								onPress={() => handleThemeChange("PinkTheme")}
							></ThemedButton>
							<ThemedButton
								style={{ backgroundColor: theme.GreenTheme.color1 }}
								onPress={() => handleThemeChange("GreenTheme")}
							></ThemedButton>
							<ThemedButton
								style={{ backgroundColor: theme.BlueTheme.color1 }}
								onPress={() => handleThemeChange("BlueTheme")}
							></ThemedButton>
						</HorisontalView>

						<ResultButton onPress={handleSubmit}>
							<RegularText color="white" style={{ marginTop: 0, fontSize: 15 }}>
								완료
							</RegularText>
						</ResultButton>

					</MainView>
				</ScrollView>
			</FullView>
		</ThemeProvider>
	);
};

const FullView = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: white;
`;

const MainView = styled(FullView)`
	align-items: stretch;
	width: 300px;
	align-self: center;
	margin-top: 20px;
`;

const HorisontalView = styled(MainView)`
  	flex-direction: row;
`;

const HorisontalViewEnd = styled(HorisontalView)`
  	justify-content: flex-end;
`;

const MainText = styled.Text`
	color: ${(props) => props.color || 'black'};
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
	width: ${(props) => props.size || '100px'};
	height: ${(props) => props.size || '100px'};
`;

const GalleryButton = styled.TouchableOpacity`
	width: 40px;
	height: 40px;
	background-color: ${(props) => props.theme.color1};
	border-radius: 100px;
	justify-content: center;
	align-items: center;
	margin-left: -30px;
	margin-top: 55px;
`;

const TextBox = styled.TouchableOpacity`
	background-color: ${(props) => props.color || '#F2F3F5'};
	width: 300px;
	height: 40px;
	border-radius: 15px;
	margin-top: 10px;
	justify-content: space-between;
	flex-direction: row;
	align-items: center;
`;

const InputName = styled.TextInput.attrs({ maxLength: 6 })`
	color: black;
	font-size: 8px;
	font-weight: normal;
	width: 100%;
	height: 100%;
	margin-left: 10px;
`;

const DisturbTimeButton = styled.Switch.attrs((props) => ({
	trackColor: {
		false: '#F2F3F5',
		true: props.theme.color1,
	},
}))`
	margin-top: 10px;
`;

const ThemedButton = styled.TouchableOpacity`
	height: 30px;
	width: 30px;
	padding: 15px;
	margin: 10px;
	border-radius: 100px;
	justify-content: center;
	align-items: center;
	background-color: ${(props) => props.theme.color1};
`;

const ResultButton = styled(TextBox)`
	background-color: ${(props) => props.theme.color1};
	margin-top: 30px;
	margin-bottom: 0px;
	justify-content: center;
	align-items: center;
`;

export default Setting_user;