import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext } from 'react';
import MyButton from '../components/MyButton.js';

export default function SignupThanksScreen(props) {
  const myContext = useContext(AppContext);

  return (
    <View style={styles.container}>
      <Text>Thank you for signing up to GateMaster.</Text>
      <Text>Please check your email. You need to activate your account before you can log in.</Text>
      <MyButton caption="Continue" onPress={() => {props.navigation.navigate('Start')}} />
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