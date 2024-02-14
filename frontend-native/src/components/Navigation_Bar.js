/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import 'react-native-gesture-handler';

import images from "../components/images";
import theme from "../components/theme";

const Navigation_Bar = ({ selectedTheme }) => {
    const navigation = useNavigation();
    const route = useRoute();

    const color_sheet = [selectedTheme.color1, selectedTheme.color2, selectedTheme.color3, selectedTheme.color4, selectedTheme.color5];

    const [selectedIcon, setSelectedIcon] = useState(null);

    useEffect(() => {
        // Set the selected icon based on the current route name
        const routeName = route.name;
        setSelectedIcon(routeName);
    }, [route]);

    const handlePress = (type) => {
        // Update the selected icon state only if it's different from the current route name
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
                color={selectedIcon === 'Diary_Main' ? color_sheet[0] : "#B7BABF"}
                onPress={() => handlePress('Diary_Main')}
            />

            <images.stat
                width={25}
                height={25}
                color={selectedIcon === 'Stat' ? color_sheet[0] : "#B7BABF"}
                onPress={() => handlePress('Stat')}
            />

            <images.todo
				width={25}
				height={25}
				color={selectedIcon === 'Todo' ? color_sheet[0] : "#B7BABF"}
				onPress={() => handlePress('Todo')}
            />

            <images.chatting
                width={25}
                height={25}
                color={selectedIcon === 'Chatting' ? color_sheet[0] : "#B7BABF"}
                onPress={() => handlePress('Chatting')}
            />

            <images.setting
                width={25}
                height={25}
                color={selectedIcon === 'Setting' ? color_sheet[0] : "#B7BABF"}
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
