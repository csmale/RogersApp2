import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext, useState } from 'react';
import MyButton from '../components/MyButton.js';
import MyInput from '../components/MyInput.js';
import { registerUser } from '../components/Backend.js';

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
  const [company, setCompany ] = useState('');
  const [err, setErr] = useState('');

  async function doSignUp() {
    if(fullName == '') {
      setErr('Please enter your full name');
      return;
    }
    if(company == '') {
      setErr('Please enter your company name');
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
    // link in email will activate the account (backend function)
    // in the mean time lets set up the password

    const prof = {
      displayname: fullName,
      username: email,
      email: email,
      company: company
    };
    const res = await registerUser(prof);
    if(res.error) {
      setErr(res.error);
      return;
    }
    if(!res.id || res.id == '') {
      setErr('no valid profile returned!')
      return;
    }
    // the initial profile has been created, minus a password. get the password set up now, while the email's on its way.
    myContext.setProfile(res);
    setErr('');
    props.navigation.navigate('ChangePassword');
  }

  return (
    <View style={styles.container}>
      <Text>Sign up to GateMaster</Text>
      <MyInput label="Full Name" value={fullName} onChangeText={setFullName} />
      <MyInput label="Company Name" value={company} onChangeText={setCompany} />
      <MyInput label="Email Address" value={email} inputMode='email' onChangeText={setEmail} />
      {err != '' && <Text style={styles.errText}>{err}</Text>}
      <MyButton caption="Continue" onPress={doSignUp} />
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