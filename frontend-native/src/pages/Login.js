/* eslint-disable prettier/prettier */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable react/self-closing-comp */

/* install 명령어

npm install @react-navigation/native --save --legacy-peer-deps
expo install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install @react-navigation/stack --save --legacy-peer-deps

*/

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