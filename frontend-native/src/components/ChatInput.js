/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react-native/no-inline-styles */

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

function ChatInput({ onSubmit }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={{
            flex: 1,
            padding: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 5,
            marginRight: 8,
          }}
          value={inputValue}
          onChangeText={text => setInputValue(text)}
          placeholder="메세지를 입력해주세요"
        />
        <TouchableOpacity onPress={handleSubmit}>
          <View
            style={{
              backgroundColor: '#007bff',
              borderRadius: 5,
              padding: 8,
            }}>
            <Text style={{ color: 'white' }}>보내기</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ChatInput;
