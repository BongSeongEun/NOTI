/* eslint-disable prettier/prettier */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */

import styled, {ThemeProvider} from "styled-components/native"
import React, { useState, useEffect } from 'react';
import {
	ScrollView,
	Text,
	Modal,
	Alert,
	TextInput,
	Button,
	TouchableOpacity,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import { decode } from 'base-64';
import axios from 'axios';

import images from "../components/images";
import Navigation_Bar from "../components/Navigation_Bar";
import { launchImageLibrary } from 'react-native-image-picker';
import { theme } from '../components/theme';
import { format } from "date-fns";

function Diary() {
   const navigation = useNavigation();
   const route = useRoute();
   const { diaryId } = route.params;

   const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
   const [userNickname, setUserNickname] = useState('');
   const [clicked_modify, setClicked_modify] = useState(false);
   const [clicked_delete, setClicked_delete] = useState(false);
   const [modal_DeleteVisible, set_DeleteModalVisible] = useState(false);
   const [diaryTitle, setDiaryTitle] = useState('');
   const [diaryContent, setDiaryContent] = useState('');
   const [diaryDate, setDiaryDate] = useState(format(new Date(), "yyyy-MM-dd"));
   const [diaryImg, setDiaryImg] = useState('');
   const [isEditing, setIsEditing] = useState(false);

   const toggleEdit = () => {
      setIsEditing(!isEditing);
   };

   const saveChanges = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
         try {
            const userId = getUserIdFromToken(token);
            await axios.put(`http://15.164.151.130:4000/api/v2/diaryUpdate/${userId}/${diaryId}`, {
               diaryTitle,
               diaryContent,
               diaryImg,
            }, {
               headers: { 'Authorization': `Bearer ${token}` },
            });
            Alert.alert("저장 성공", "일기가 성공적으로 업데이트되었습니다.", [
               {
                  text: "확인", onPress: () => {
                     setIsEditing(false);
                     setClicked_modify(!clicked_modify);
                  }
               }]);
         } catch (error) {
            console.error("Error updating diary:", error);
            Alert.alert("저장 실패", "일기 업데이트 중 문제가 발생했습니다.");
         }
      }
   };

    useEffect(() => {
      const fetchUserData = async () => {
         const token = await AsyncStorage.getItem('token');

         if (token) {
            const userId = getUserIdFromToken(token);
            try {
               const response = await axios.get(`http://15.164.151.130:4000/api/v1/userInfo/${userId}`, {
                  headers: {
                     'Authorization': `Bearer ${token}`,
                  },
               });
               const userThemeName = response.data.userColor || 'OrangeTheme';
               const userProfileImage = response.data.userProfile;
               const nickname = response.data.userNickname;

               if (theme[userThemeName]) {
                  setCurrentTheme(theme[userThemeName]);
               }
               setBase64Image(userProfileImage || ''); 
               setUserNickname(nickname || ''); 
            } catch (error) {
               console.error("Error fetching user data:", error);
            }
         }
      };
      fetchUserData();
   }, []);

    const getUserIdFromToken = (token) => {
        try {
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

   useEffect(() => {
        const fetchDiaryDetail = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
            try {
               const userId = getUserIdFromToken(token);
                    const response = await axios.get(`http://15.164.151.130:4000/api/v2/diaryDetail/${userId}/${diaryId}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
               });
               if (response.data) {
                        setDiaryTitle(response.data.diaryTitle);
                  setDiaryContent(response.data.diaryContent);
                  setDiaryDate(response.data.diaryDate);
                  setDiaryImg(response.data.diaryImg);
                    }
                } catch (error) {
                    console.error("Error fetching diary detail:", error);
                }
            }
        };

        fetchDiaryDetail();
    }, [diaryId]);

	const deleteDiary = async () => {
		const token = await AsyncStorage.getItem('token');
		if (token) {
			try {
				const userId = getUserIdFromToken(token);
				console.log(userId);
				await axios.delete(`http://15.164.151.130:4000/api/v2/diaryDelete/${userId}/${diaryId}`, {
					headers: { 'Authorization': `Bearer ${token}` },
				});
				Alert.alert("삭제 성공", "일기가 성공적으로 삭제되었습니다.", [
					{ text: "확인", onPress: () => navigation.goBack() },
				]);
			} catch (error) {
				console.error("Error deleting diary:", error);
				Alert.alert("삭제 실패", "일기 삭제 중 문제가 발생했습니다.");
			}
		}
	};

	const selectImage = () => {
		launchImageLibrary({ mediaType: 'photo' }, (response) => {
			if (response.didCancel) {
				console.log('User cancelled image picker');
			} else if (response.error) {
				console.log('ImagePicker Error: ', response.error);
			} else {
				const source = { uri: response.assets[0].uri };
				setDiaryImg(source.uri);
			}
		});
	};

	return (
		<ThemeProvider theme={currentTheme}>
			<FullView>
				<MainView>
					<HorisontalView style={{ marginTop: 20, marginBottom: 10 }}>
						<Profile source={base64Image ? { uri: base64Image } : images.profile}
							style={{ marginTop: 20 }} />
						<ProfileTextContainer>
							<MainText>{userNickname} 님,</MainText>
							<MainText style={{ color: currentTheme.color1 }}>
								{diaryDate} 일기입니다!
							</MainText>
						</ProfileTextContainer>
					</HorisontalView>
				</MainView>
			</FullView>
         
			<FullView style={{ flex: 1, marginBottom: 80 }}>
				<Bar />

				<ScrollView>
					<MainView>
						<HorisontalView style={{ justifyContent: 'flex-end', padding: 15 }}>
							{!isEditing ? (
								<>
									<images.diary_modify width={20} height={20}
										color={clicked_modify ? currentTheme.color1 : "#B7BABF"}
										style={{ marginRight: 10 }}
										onPress={() => {
											setClicked_modify(!clicked_modify);
											toggleEdit();
										}} />
									<images.diary_delete width={20} height={20}
										color={clicked_delete ? currentTheme.color1 : "#B7BABF"}
										onPress={() => {
											setClicked_delete(!clicked_delete);
											set_DeleteModalVisible(true);
										}} />
								</>
							) : (
								<Text onPress={saveChanges} style={{ color: currentTheme.color1 }}>완료</Text>
							)}
						</HorisontalView>

						{!isEditing ? (
							<>
								<Diary_TItle style={{ margin: 10, fontSize: 20 }}>{diaryTitle}</Diary_TItle>
								<DiaryText style={{ margin: 10 }}>{diaryContent}</DiaryText>
								{diaryImg ? (
									<Diary_Picture source={{ uri: diaryImg }} style={{ width: 250, height: 250, margin: 10 }} />
								) : null}
							</>
						) : (
							<>
								<TextInput
									value={diaryTitle}
									onChangeText={setDiaryTitle}
									style={{ margin: 10, fontSize: 20, borderBottomWidth: 1, borderColor: '#ccc' }}
								/>
								<TextInput
									value={diaryContent}
									onChangeText={setDiaryContent}
									multiline
									style={{ margin: 10, textAlignVertical: 'top', fontSize: 10, minHeight: 100, padding: 5 }}
								/>
								{diaryImg ? (
									<TouchableOpacity onPress={selectImage}>
										<Diary_Picture source={{ uri: diaryImg }} style={{ width: 250, height: 250, margin: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 15 }} />
									</TouchableOpacity>
								) : (
									<TouchableOpacity onPress={selectImage} style={{ width: 250, height: 250, backgroundColor: '#D3D3D3', justifyContent: 'center', alignSelf: 'center', alignItems: 'center', margin: 10, borderRadius: 15 }}>
										<Text style={{ color: '#ffffff' }}>사진 선택</Text>
									</TouchableOpacity>
								)}
							</>
						)}
						<Modal
							animationType="slide"
							transparent={true}
							visible={modal_DeleteVisible}
							onRequestClose={() => set_DeleteModalVisible(false)}>
							<ModalContainer>
								<ModalView>
									<MainText style={{ margin: 20, fontSize: 15 }}>일기를 정말 삭제하시겠습니까? </MainText>
									<HorisontalView style={{ alignItems: 'center', justifyContent: 'center' }}>
										<Delete
											onPress={() => {
												set_DeleteModalVisible(!modal_DeleteVisible);
												setClicked_delete(false);
												deleteDiary();
											}}
											style={{ backgroundColor: "#F2F3F5" }}
										>
											<Text>예</Text>
										</Delete>

										<Delete
											onPress={() => {
												set_DeleteModalVisible(!modal_DeleteVisible);
												setClicked_delete(false);
											}}
											style={{ backgroundColor: currentTheme.color1 }}
										>
                                 
											<Text style={{ color: "white" }}>아니요</Text>
										</Delete>
									</HorisontalView>
								</ModalView>
							</ModalContainer>
						</Modal>
					</MainView>
				</ScrollView>
			</FullView>
			<Navigation_Bar />
		</ThemeProvider>
	);
}

const FullView = styled.View`
   width: 100%;
   background-color: white;
`;

const MainView = styled(FullView)`
   height: auto;
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
   margin-bottom: 25px;
`;

const Profile = styled.Image`
    width: 40px;
    height: 40px;
    margin-left: 20px;
   border-radius: 100px;
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
    background-color: #B7BABF;
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
   border-top-right-radius: 20px;
   width: 100%;
   height: 250px;
    align-items: center;
`;

const Delete = styled.TouchableOpacity`
   width: 120px;
   height: 40px;
   border-radius: 15px;
   justify-content: center;
   align-items: center;
   margin: 20px;
`;

const Diary_TItle = styled.Text`
   font-size: ${props => props.fontSize || "15px"};
   text-align: center;
   font-weight: bold;
   color: ${props => props.color || "black"};
`;

const DiaryText = styled(MainText)`
   font-size: 10px;
   font-weight: normal;
`;

const Diary_Picture = styled.Image`
   width: 280px;
   height: 280px;
   align-self: center;
   border-radius: 15px;
`;

export default Diary;