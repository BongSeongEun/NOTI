/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/self-closing-comp */

import React from 'react';
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";


function Login({}) {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Login!</Text>
	    <Button
    	  title="회원가입"
          // eslint-disable-next-line quotes
          onPress={() => navigation.navigate("Register")}>
        </Button>
    </View>
  );
}

export default Login;