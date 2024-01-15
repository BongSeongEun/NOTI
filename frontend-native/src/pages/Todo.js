/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import styled from "styled-components/native"

import React from 'react';
import {
	View,
	Text,
	Button,
	Image,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

function Todo({ }) {
	const navigation = useNavigation();

	return (
		<View>
			<Text>일정</Text>
		</View>
	);

}

export default Todo;