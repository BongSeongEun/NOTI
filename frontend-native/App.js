import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import styled from "styled-components/native";
import 'react-native-gesture-handler';

import Login from "./src/pages/Login";
import Coop from "./src/pages/Coop";
import Diary from "./src/pages/Diary";
import Register from "./src/pages/Register";
import Register_Success from "./src/pages/Register_Success";
import Setting from "./src/pages/Setting";
import Todo from "./src/pages/Todo";
<<<<<<< HEAD
import Chatting from "./src/pages/Chatting";
=======
import Todo_Add from "./src/pages/Todo_Add";
>>>>>>> 181fc5c5f7ba9b4b71c13e44dd04dbb1d41b2b53

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
    	<Stack.Navigator initialRouteName="Login">
        	<Stack.Screen name="Login" component={Login} />
        
			<Stack.Screen name="Register" component={Register} />
			<Stack.Screen name="Register_Success" component={Register_Success} />
		
			<Stack.Screen name="Todo" component={Todo} />
<<<<<<< HEAD

			<Stack.Screen name="Chatting" component={Chatting} />
=======
			<Stack.Screen name="Todo_Add" component={Todo_Add} />
			<Stack.Screen name="Coop" component={Coop} />

			<Stack.Screen name="Diary" component={Diary} />
			<Stack.Screen name="Setting" component={Setting} />
>>>>>>> 181fc5c5f7ba9b4b71c13e44dd04dbb1d41b2b53
      	</Stack.Navigator>
    </NavigationContainer>
  );
}