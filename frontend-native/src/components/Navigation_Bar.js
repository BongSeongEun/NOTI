/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled, { ThemeProvider } from 'styled-components/native';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { decode } from 'base-64';
import axios from 'axios';

import 'react-native-gesture-handler';

import images from "../components/images";
import theme from "../components/theme";

const Navigation_Bar = ({ selectedTheme }) => {
    const navigation = useNavigation();
    const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
	const [selectedIcon, setSelectedIcon] = useState(null);
	const host = "192.168.30.197";
	
	useEffect(() => {
		const fetchUserData = async () => {
			const token = await AsyncStorage.getItem('token');
			if (token) {
				const userId = getUserIdFromToken(token);
				try {
					const response = await axios.get(`http://${host}:4000/api/v1/userInfo/${userId}`, {
						headers: {
							'Authorization': `Bearer ${token}`,
						},
					});
					const userThemeName = response.data.userColor || 'OrangeTheme';
					if (theme[userThemeName]) {
						setCurrentTheme(theme[userThemeName]);
					} 
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

    const handlePress = (type) => {
        if (selectedIcon !== type) {
            setSelectedIcon(type);
        }
        navigation.navigate(type,  { selectedTheme: selectedTheme });
    };

    return (
        <NavigationView>
            <images.diary
                width={25}
                height={25}
                color={selectedIcon === 'Diary_Main' ? currentTheme.color1 : "#B7BABF"}
                onPress={() => handlePress('Diary_Main')}
            />
            <images.stat
                width={25}
                height={25}
                color={selectedIcon === 'Stat' ? currentTheme.color1 : "#B7BABF"}
                onPress={() => handlePress('Stat')}
            />
            <images.todo
				width={25}
				height={25}
				color={selectedIcon === 'Todo' ? currentTheme.color1 : "#B7BABF"}
				onPress={() => handlePress('Todo')}
            />
            <images.chatting
                width={25}
                height={25}
                color={selectedIcon === 'Chatting' ? currentTheme.color1 : "#B7BABF"}
                onPress={() => handlePress('Chatting')}
            />
            <images.setting
                width={25}
                height={25}
                color={selectedIcon === 'Setting' ? currentTheme.color1 : "#B7BABF"}
                onPress={() => handlePress('Setting')}
            />
        </NavigationView>
    );
};

const NavigationView = styled.View`
    width: 100%;
    height: 40px;
    flex-direction: row;
    justify-content: space-between;
    padding: 40px;
    align-items: center;
    position: absolute;
    bottom: 0;
    background-color: white;
`;

export default Navigation_Bar;
