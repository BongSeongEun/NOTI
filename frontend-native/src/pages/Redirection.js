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
        axios
          .post(`http://192.168.30.112:4000/authnative?code=${code}`)
          .then(async res => {
            const token = res.headers.authorization;
            await AsyncStorage.setItem('token', token);
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
