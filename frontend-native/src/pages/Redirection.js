/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, {useEffect, useState} from 'react';
import {View, Text, Linking} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const Redirection = () => {
  const [fcmToken, setFcmToken] = useState('');

  const getFcmToken = async () => {
    const fcmTokenInfo = await messaging().getToken();
    setFcmToken(fcmTokenInfo);
  };

  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = event => {
      const code = new URL(event.url).searchParams.get('code');
      if (code) {
        getFcmToken();
        axios.post(`http://15.164.151.130:4000/api/v1/user/${userId}`, {
          deviceToken: fcmToken,
        });
        axios
          .post(`http://15.164.151.130:4000/authnative?code=${code}`)
          .then(async res => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            await AsyncStorage.setItem(token);
            navigation.navigate('Todo');
          })
          .catch(err => console.log(err));
      }
    };
    Linking.addEventListener('url', handleDeepLink);

    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, [navigation, fcmToken]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Redirecting...</Text>
    </View>
  );
};

export default Redirection;
