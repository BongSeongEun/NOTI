/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm }) => {
	return (
		<Modal
		visible={isOpen}
		transparent
		animationType="fade"
		onRequestClose={onClose}
		>
		<View style={styles.modalBackdrop}>
			<View style={styles.modalContainer}>
			<Text style={styles.messageText}>정말 삭제하시겠습니까?</Text>
			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.button} onPress={onConfirm}>
				<Text style={styles.buttonText}>예</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.button} onPress={onClose}>
				<Text style={styles.buttonText}>아니오</Text>
				</TouchableOpacity>
			</View>
			</View>
		</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	modalBackdrop: {
		flex: 1,
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		justifyContent: "center",
		alignItems: "center",
	},
	modalContainer: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		alignItems: "center",
	},
	messageText: {
		color: "black",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "center",
		marginTop: 10,
	},
	button: {
		width: 100,
		paddingVertical: 10,
		borderRadius: 5,
		backgroundColor: "blue",
		marginHorizontal: 10,
	},
	buttonText: {
		color: "white",
		textAlign: "center",
	},
});

export default ConfirmDeleteModal;
