import React from 'react';
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";


function Login({}) {
  const navigation = useNavigation();
  return (
    <View>
      <Text>Login!</Text>
	    <Button
    	  title="Main"
          onPress={() => navigation.push("Main")}>
        </Button>
    </View>
  );
}

export default Login;