/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import styled from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { decode } from 'base-64';
import axios from 'axios';

import 'react-native-gesture-handler';

import images from "../components/images";
import theme from "../components/theme";

const Navigation_Bar = ({ selectedTheme }) => {
	const navigation = useNavigation();
	const route = useRoute();

    const [currentTheme, setCurrentTheme] = useState(theme.OrangeTheme);
	
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
        navigation.navigate(type);
    };

    const getIconColor = (pageNameGroup) => {
        const isCurrentPage = pageNameGroup.includes(route.name);
        return isCurrentPage ? currentTheme.color1 : "#B7BABF";
    };

    return (
        <NavigationView>
            <images.diary
                width={25}
                height={25}
                color={getIconColor(['Diary_Main', 'Diary'])}
                onPress={() => handlePress('Diary_Main')}
            />
            <images.stat
                width={25}
                height={25}
                color={getIconColor(['Stat'])}
                //onPress={() => handlePress('Stat')}
            />
            <images.todo
                width={25}
                height={25}
                color={getIconColor(['Todo', 'Coop', 'Coop_Main'])}
                onPress={() => handlePress('Todo')}
            />
            <images.chatting
                width={25}
                height={25}
                color={getIconColor(['Chatting'])}
                onPress={() => handlePress('Chatting')}
            />
            <images.setting
                width={25}
                height={25}
                color={getIconColor(['Setting'])}
                //onPress={() => handlePress('Setting')}
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
