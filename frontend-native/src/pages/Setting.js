/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import styled, { ThemeProvider } from "styled-components/native"

import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import 'react-native-gesture-handler';
import Navigation_Bar from "../components/Navigation_Bar";
import { theme } from '../components/theme';


function Setting({ }) {
	const navigation = useNavigation();
	const route = useRoute();
	const { selectedTheme } = route.params || { selectedTheme: theme.DefaultTheme };

	return (
		<ThemeProvider theme={selectedTheme}>
			<View>
				<Text>설정</Text>
			</View>
			<Navigation_Bar selectedTheme={selectedTheme} />
		</ThemeProvider>
		
	);
}

export default Setting;