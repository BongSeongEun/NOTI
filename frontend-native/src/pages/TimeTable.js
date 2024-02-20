/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

const TimeTable = ({ schedule }) => (
	<View style={styles.timeTableContainer}>
		{Array.from({ length: 24 }).map((_, hour) => (
		<View key={hour} style={styles.hourRow}>
			<Text style={styles.hourLabel}>{`${hour < 10 ? `0${hour}` : hour}`}</Text>
			<View style={styles.minuteBlocks}>
			{Array.from({ length: 6 }).map((__, minute) => (
				<View
				key={minute}
				style={[
					styles.minuteBlock,
					{
					backgroundColor: schedule[hour * 6 + minute]
						? schedule[hour * 6 + minute]
						: "transparent",
					},
				]}
				/>
			))}
			</View>
		</View>
		))}
	</View>
);

const styles = StyleSheet.create({
	timeTableContainer: {
		flexDirection: "column",
		marginRight: 35,
		width: "60%",
		marginTop: 20,
	},
	hourRow: {
		flexDirection: "row",
		alignItems: "center",
	},
	hourLabel: {
		width: 50,
		textAlign: "right",
		paddingRight: 10,
	},
	minuteBlocks: {
		flex: 1,
		flexDirection: "row",
	},
	minuteBlock: {
		flex: 1,
		borderWidth: 1,
		borderColor: "#ddd",
		height: 20,
	},
});

export default TimeTable;
