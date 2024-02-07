/* eslint-disable no-trailing-spaces */
/* eslint-disable prettier/prettier */
import React, { useState, } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import styled from "styled-components/native";
import 'react-native-gesture-handler';

import images from "../components/images";
import theme from "../components/theme";

const Navigation_Bar =  ({ selectedTheme }) => {
	const navigation = useNavigation();
    const route = useRoute();

	const color_sheet = [selectedTheme.color1, selectedTheme.color2, selectedTheme.color3, selectedTheme.color4, selectedTheme.color5];

	const [isDiary, setDiary] = useState(false);
	const [isStat, setStat] = useState(false);
	const [isTodo, setTodo] = useState(false);
	const [isChatting, setChatting] = useState(false);
	const [isSetting, setSetting] = useState(false);

	const handlePress = (type) => {
		switch (type) {
			case 'diary':
				setDiary(!isDiary);
				break;
			case 'stat':
				setStat(!isStat);
				break;
			case 'todo':
				setTodo(!isTodo);
				break;
			case 'chatting':
				setChatting(!isChatting);
				break;
			case 'setting':
				setSetting(!isSetting);
				break;
		}
	};
	
	return (
		<NavigationView>
			<images.diary
				width={25}
				hight={25}
				color={isDiary ? color_sheet[0] : "#B7BABF"}
				onPress={() => { 
					handlePress('diary');
					navigation.navigate('Diary');
				}}
			/>

			<images.stat
				width={25}
				hight={25}
				color={isStat ? color_sheet[0] : "#B7BABF"}
				onPress={() => { 
					handlePress('stat');
					navigation.navigate('Stat');
				}}
			/>

			<images.todo
				width={25}
				hight={25}
				color={isTodo ? color_sheet[0] : "#B7BABF"}
				onPress={() => { 
					handlePress('todo');
					navigation.navigate("Todo", { selectedTheme: selectedTheme });
				}}
			/>

			<images.chatting
				width={25}
				hight={25}
				color={isChatting ? color_sheet[0] : "#B7BABF"}
				onPress={() => { 
					handlePress('chatting');
					navigation.navigate('Chatting');
				}}
			/>

			<images.setting
				width={25}
				hight={25}
				color={isSetting ? color_sheet[0] : "#B7BABF"}
				onPress={() => { 
					handlePress('setting');
					navigation.navigate('Setting');
				}}
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