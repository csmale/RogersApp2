import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext, useState } from 'react';
import MyButton from '../components/MyButton.js';
import MyInput from '../components/MyInput.js';

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function SignupScreen(props) {
  const myContext = useContext(AppContext);
  const [fullName, setFullName ] = useState('');
  const [email, setEmail ] = useState('');
  const [err, setErr] = useState('');

  async function doSignUp() {
    if(fullName == '') {
      setErr('Please enter your full name');
      return;
    }
    if(email == '') {
      setErr('Please enter your email address');
      return;
    }
    if(!validateEmail(email)) {
      setErr('Email address is malformed');
      return;
    }
    // api call
    // account will be locked pending email confirmation
    // link in email will active the account (backend function)
    setErr('');
    props.navigation.navigate('SignupThanks');
  }

  return (
    <View style={styles.container}>
      <Text>Sign up to GateMaster</Text>
      <MyInput label="Full Name" value={fullName} onChangeText={setFullName} />
      <MyInput label="Email Address" value={email} inputMode='email' onChangeText={setEmail} />
      {err != '' && <Text style={styles.errText}>{err}</Text>}
      <MyButton caption="Sign up" onPress={doSignUp} />
      <MyButton caption="Cancel" onPress={()=>{props.navigation.goBack()}} />
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
  errText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red"
},
});