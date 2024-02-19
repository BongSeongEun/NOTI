/* eslint-disable prettier/prettier */
import styled, { ThemeProvider } from 'styled-components/native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { decode } from 'base-64';
import axios from 'axios';

import DecoesSvg from '../asset/Deco_Svg';
import { theme } from '../components/theme';

function Register_Success() {
    const navigation = useNavigation();
    const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
    const [base64Image, setBase64Image] = useState('');
    const [userNickname, setUserNickname] = useState('');

    useEffect(() => {
		const fetchUserData = async () => {
			const token = await AsyncStorage.getItem('token');

			if (token) {
				const userId = getUserIdFromToken(token);
				console.log(`userId: ${userId}, token: ${token}`);
				try {
					const response = await axios.get(`http://172.20.10.5:4000/api/v1/userInfo/${userId}`, {
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
					setBase64Image(userProfileImage || ""); 
					setUserNickname(nickname || ""); 
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

    return (
        <ThemeProvider theme={currentTheme}>
			<FullView>
                <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 80 }}>
                    <RegularText>프로필 생성 완료!</RegularText>
                    <MainText>{userNickname} 님! 노티에 {'\n'} 오신 것을 환영해요</MainText>
                    <ProfileContainer>
                        <Profile  source={{ uri: `data:image/png;base64,${base64Image}` }}
        						style={{ width: 130, height: 130, position: 'absolute', marginTop: 30 }} />
						<DecoesSvg currentTheme={currentTheme}
							style={{ position: 'absolute', marginRight: 10 }} />
                    </ProfileContainer>
                    <ResultButton onPress={() => navigation.navigate("Todo", { selectedTheme: currentTheme })}>
                        <ResultText>완료</ResultText>
                    </ResultButton>
                </ScrollView>
            </FullView>
        </ThemeProvider>
    );
}

const FullView = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
	background-color: #333333;
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

const ProfileContainer = styled.View`
    position: relative;
    align-items: center;
	margin-top: 50px;
`;

const Profile = styled.Image`
    width: 120px;
    height: 120px;
    border-radius: 100px;
`;

const MainText = styled.Text`
    color: white;
    font-size: 20px;
    font-weight: bold;
    margin: 20px;
    text-align: center;
`;

const RegularText = styled.Text`
    color: ${props => props.theme.color1};
    font-size: 15px;
    font-weight: bold;
    margin-top: 20px;
`;

const ResultText = styled.Text`
    color: white;
    font-size: 16px;
    font-weight: bold;
`;

const ResultButton = styled.TouchableOpacity`
    width: 300px;
    height: 50px;
    background-color: ${props => props.theme.color1};
    border-radius: 25px;
    margin-top: 100px;
    justify-content: center;
    align-items: center;
`;

export default Register_Success;
