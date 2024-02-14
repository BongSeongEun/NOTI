/* eslint-disable prettier/prettier */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-mixed-spaces-and-tabs */

import React from 'react';
import { Text, View } from 'react-native';
import styled, { ThemeProvider } from 'styled-components/native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Navigation_Bar from '../components/Navigation_Bar';
import { theme } from '../components/theme';

function Diary() {
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedTheme } = route.params || { selectedTheme: theme.DefaultTheme };

  const { date, title, contents } = route.params.diaryData;

  return (
    <ThemeProvider theme={selectedTheme}>
      <Container>
        <Text>Date: {date}</Text>
        <Text>Title: {title}</Text>
        <Text>Contents: {contents}</Text>
      </Container>
      <Navigation_Bar selectedTheme={selectedTheme} />
    </ThemeProvider>
  );
}

export default Diary;

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
