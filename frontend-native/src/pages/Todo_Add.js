/* eslint-disable prettier/prettier */

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

import images from "../components/images";

function Todo_Add({ }) {
	const navigation = useNavigation();

	return (
		<View>
			<Text>노티 추가</Text>
		</View>
	);
}

const Styles = styled.View`
`;

const MainText = styled.Text`
`;

const SText = styled.Text`
`;

const ColorSheet = styled.TouchableOpacity`
`;

const ResultButton = styled.TouchableOpacity`
`;

export default Todo_Add;