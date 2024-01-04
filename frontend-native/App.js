import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

function App(){
    const [message, setMessage] = useState([]);

    useEffect(()=>{
        fetch("http://localhost:4000/api/v1/welcome")
          .then(response => response.json())
          .then(data => setMessage(data))
          .catch(error => {console.log(error)})
          },[]);

    return(
        <View style={styles.container}>
            <Text>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#FFFFFF",
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;
