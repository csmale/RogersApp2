import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext } from 'react';
import MyButton from '../components/MyButton.js';
import Destination from '../components/Structs.js';

export default function EditDestScreen(props) {
  const myContext = useContext(AppContext);

  return (
    <View style={styles.container}>
      <Text>Editing destination details for {myContext.Profile.displayname}</Text>
      <Text>{myContext.Profile.company}</Text>
      <MyButton caption="Done" onPress={()=>props.navigation.navigate('Main')} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});