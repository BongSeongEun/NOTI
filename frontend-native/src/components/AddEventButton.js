/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */


import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const AddEventButton = ({ onPress }) => (
	<TouchableOpacity style={styles.button} onPress={onPress}>
		<Text style={styles.buttonText}>Add Event</Text>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	button: {
		backgroundColor: "grey",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 20,
		marginTop: 20,
	},
	buttonText: {
		color: "white",
	},
});

export default AddEventButton;
