/* eslint-disable no-undef */
/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {View, Text, Linking} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Redirection = () => {
  const navigation = useNavigation();

  useEffect(() => {
	  const handleDeepLink = event => {
		  const code = new URL(event.url).searchParams.get('code');
		  if (code) {
			  const host = "192.168.30.83";
			  axios
				  .post(`http://${host}/authnative?code=${code}`)
				  .then(async res => {
					  const params = new URLSearchParams(location.search);
					  const token = params.get("token");
					  await AsyncStorage.setItem(token);
					  navigation.navigate('Register');
				  })
				  .catch(err => console.log(err));
		  }
	  };

    Linking.addEventListener('url', handleDeepLink);

    // Cleanup
    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, [navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Redirecting...</Text>
    </View>
  );
};

export default Redirection;
