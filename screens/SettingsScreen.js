import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext, useState } from 'react';
import MyButton from '../components/MyButton.js';

export default function SettingsScreen(props) {
  const myContext = useContext(AppContext);
  const profile = myContext.Profile;
  const [email, setEmail] = useState(profile.email);
  const [dunits, setDunits] = useState(profile.distance_units);

  return (
    <View style={styles.container}>
      <Text>Setting for {profile.username}</Text>
      <Text>User ID: {profile.userid}</Text>
      <Text>Company: {profile.company}</Text>
      <Text>Email: {email}</Text>
      <Text>Distance units: {dunits}</Text>
      <MyButton caption="Save" onPress={()=>props.navigation.navigate('Main')} {...props} />
      <MyButton caption="Cancel" onPress={()=>props.navigation.navigate('Main')} {...props} />
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