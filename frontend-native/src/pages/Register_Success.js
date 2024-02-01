/* eslint-disable prettier/prettier */
import React from 'react';
import { ScrollView } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import 'react-native-gesture-handler';

import DecoesSvg from '../asset/Deco_Svg';
import { theme } from '../components/theme';
import images from '../components/images';
import GradationSvg from '../asset/gradation.svg';

function Register_Success() {
    const navigation = useNavigation();
    const name = "홍길동";

    const route = useRoute();
    const { currentTheme } = route.params;
    const selectedTheme = currentTheme || theme.OrangeTheme;

    return (
        <ThemeProvider theme={selectedTheme}>
            <MainViewStyle>
                <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 50 }}>
                    <RegularText>
                        프로필 생성 완료!
                    </RegularText>

                    <MainText>
                        {name} 님! 노티에 {'\n'} 오신 것을 환영해요
                    </MainText>

                    <ProfileContainer>
                        <Profile source={images.profile} />
						<DecoesSvg currentTheme={selectedTheme} />
                    </ProfileContainer>

                    <ResultButton onPress={() => navigation.navigate("Todo")}>
                        <ResultText>완료</ResultText>
                    </ResultButton>
                </ScrollView>
            </MainViewStyle>
        </ThemeProvider>
    );
}

const MainViewStyle = styled.View`
    flex: 1;
    background-color: #333333;
    justify-content: center;
    align-items: center;
`;

const ProfileContainer = styled(MainViewStyle)`
    position: relative;
	margin-top: 30px;
`;

const Profile = styled.Image`
    width: 120px;
    height: 120px;
    position: absolute;
	justify-content: center;
    align-items: center;
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
    font-family: Pretendard;
`;

const ResultButton = styled.TouchableOpacity`
    width: 300px;
    height: 50px;
    background-color: ${props => props.theme.color1};
    border-radius: 25px;
    margin-top: 50px;
    justify-content: center;
    align-items: center;
`;

export default Register_Success;