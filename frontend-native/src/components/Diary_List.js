/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'base-64';
import styled from 'styled-components/native';

const DiaryItemContainer = styled.TouchableOpacity`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 10px;
  margin: 10px 0;
  width: 80%;
  align-self: center;
`;

const DiaryTitle = styled.Text`
  margin: 0;
  color: #333;
`;

const DiaryDate = styled.Text`
  margin-bottom: 5px;
  font-size: 14px;
  color: #666;
`;

const DetailContainer = styled.View`
  width: 70%;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  align-self: center;
`;

const DiaryList = () => {
  const [selectedDiaryId, setSelectedDiaryId] = useState(null);
  const [diaries, setDiaries] = useState([]);

  const getUserIdFromToken = async () => {
    const token = await AsyncStorage.getItem('token');
    const payload = token.split('.')[1];
    const base642 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = decode(base642);
    const decodedJSON = JSON.parse(decodedPayload);

    console.log(decodedJSON);
    return decodedJSON.id.toString();
  };

  useEffect(() => {
    const fetchDiaries = async () => {
      const userId = await getUserIdFromToken();
      try {
        const response = await axios.get(`http://172.20.10.5:4000/api/v2/diarylist/${userId}`);
        const sortedDiaries = response.data.sort(
          (a, b) => new Date(b.diaryDate) - new Date(a.diaryDate),
        );
        setDiaries(sortedDiaries);
      } catch (error) {
        console.error("Failed to fetch diaries", error);
      }
    };

    fetchDiaries();
  }, []);

  const handleDiaryClick = async diaryId => {
    if (selectedDiaryId === diaryId) {
      setSelectedDiaryId(null);
    } else {
      setSelectedDiaryId(diaryId);
    }
  };

  return (
    <ScrollView>
      {diaries.map(diary => (
        <React.Fragment key={diary.diaryId}>
          <DiaryItemContainer onPress={() => handleDiaryClick(diary.diaryId)}>
            <DiaryDate>{diary.diaryDate}</DiaryDate>
            <DiaryTitle>{diary.diaryTitle}</DiaryTitle>
          </DiaryItemContainer>
          {selectedDiaryId === diary.diaryId && (
            <DetailContainer>
              <Text>{diary.diaryContent || "Loading..."}</Text>
            </DetailContainer>
          )}
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

export default DiaryList;
