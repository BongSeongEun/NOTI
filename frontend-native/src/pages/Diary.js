/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import styled, { keyframes } from "styled-components/native"

import React, { useState } from 'react';
import {
	View,
	Text,
	ScrollView,
	Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import 'react-native-gesture-handler';

function Diary({ }) {
	const navigation = useNavigation();

	return (
		<View>
			<Text>일기</Text>
		</View>
	);
}

export default Diary;