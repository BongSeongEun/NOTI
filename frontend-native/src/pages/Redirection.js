/* eslint-disable prettier/prettier */
import React, {useEffect} from 'react';
import {View, Text, Button} from 'react-native';
import axios from 'axios';
import {useNavigation, useRoute, Linking} from '@react-navigation/native';

const Redirection = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const getInitialURL = async () => {
      const initialURL = await Linking.getInitialURL();
      const code = new URL(initialURL).searchParams.get('code');

      if (code) {
        axios.post(`/auth?code=${code}`).then(res => {
          const token = res.headers.authorization;
          window.localStorage.setItem('token', token); // 리액트 네이티브에서는 AsyncStorage를 사용합니다.
          navigation.navigate('Register'); // 'Register'는 네비게이션에 정의된 스크린 이름입니다.
        });
      }
    };

    getInitialURL();
  }, [navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text>Redirecting...</Text>
    </View>
  );
};

export default Redirection;
