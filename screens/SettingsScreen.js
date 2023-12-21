import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Switch } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext, useState } from 'react';
import MyButton from '../components/MyButton.js';
import MyInput from '../components/MyInput.js';
import MyDropdown from '../components/MyDropdown.js';
import { updateProfile, logoffUser } from '../components/Backend';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function SettingsScreen(props) {
  const myContext = useContext(AppContext);
  const navigation = props.navigation;
  const profile = myContext.Profile;
  const [email, setEmail] = useState(profile.email);
  const [displayname, setDisplayname] = useState(profile.displayname);
  const [dunits, setDunits] = useState(profile.distance_units);
  const [company, setCompany] = useState(profile.company);
  const [biometrics, setBiometrics] = useState(myContext.UseBiometrics);
  const [errTxt, setErrTxt] = useState('');
  const [bio, setBio] = useState(false);
  const dunitdata = [
    { label: "Miles", value: "mi" },
    { label: "Kilometres", value: "km" }
  ];

  const toggleSwitch = () => setBiometrics(previousState => !previousState);

  LocalAuthentication.hasHardwareAsync().then((data) => {
    setBio(data);
  });

  async function doSaveSettings() {
    setErrTxt('');
    let e = [];
    if (email == '') {
      e.push('Please enter your email address');
    } else {
      if (!validateEmail(email)) {
        e.push('Please enter a valid email address');
      }
    }
    if (company == '') {
      e.push('Please enter your company name');
    }
    if (e.length > 0) {
      setErrTxt(e.join('\n'));
      return;
    }
    const opts = {
      id: profile.id,
      userid: profile.userid,
      company: company,
      email: email,
      displayname: displayname,
      distance_units: dunits
    }

    res = await updateProfile(opts);
    console.log(`returned ${JSON.stringify(res)}`);
    if (res.error) {
      setErrTxt(res.error);
    } else {
      myContext.setUseBiometrics(biometrics);
      await AsyncStorage.setItem('biometrics', biometrics ? "y" : "n");
      navigation.replace('Main');
    }
  }

  async function doSignOut() {
    // tell backend
    const res = await logoffUser(myContext.Session, myContext.DeviceId);
    if(res == null) {
      setErrTxt('Unable to sign off');
      return;
    }
    if(res.error) {
      setErrTxt(res.error);
      return;
    }
    // update context
    myContext.setIsLoggedIn(false);
    // clear session in local storage
    await AsyncStorage.setItem('session', '');
    // navigate back to startup screen
    navigation.replace('Start');
  }

  return (
    <View style={styles.container}>
      <Text>Setting for {profile.username}</Text>
      <Text>User ID: {profile.userid}</Text>
      <MyInput label='Company:' placeholder='Your company name' value={company} onChangeText={setCompany} />
      <MyInput label='Display Name:' placeholder='' value={displayname} onChangeText={setDisplayname} />
      <View style={styles.searchcontainer}>
        <MyDropdown
          label="Distance units:"
          data={dunitdata}
          labelField="label"
          valueField="value"
          placeholder='Select...'
          value={dunits}
          onChange={setDunits} >
        </MyDropdown>
      </View>
      <MyInput label='Email:' placeholder='Your email address' inputMode='email' value={email} onChangeText={setEmail} />
      {errTxt != '' && <Text style={styles.errText}>{errTxt}</Text>}
      {bio && <View style={styles.switchcontainer}>
        <Text style={styles.label}>Use Biometric Login:</Text>
        <Switch
          style={styles.switch}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={biometrics ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={biometrics}
        />
      </View>}
      <MyButton caption="Save" onPress={() => doSaveSettings()}  />
      <MyButton caption="Change Password" onPress={() => navigation.navigate('ChangePassword')} />
      <MyButton caption="Sign out" onPress={() => doSignOut()} />
      <MyButton caption="Cancel" onPress={() => navigation.navigate('Main')} />
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
  searchcontainer: {
    backgroundColor: '#fff',
    alignItems: 'left',
    alignContent: 'left',
    justifyContent: 'left',
  },
  errText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red"
  },
  switchcontainer: {
    flexDirection:"row",
    borderColor: "red",
    //borderWidth: 1,
    alignItems: 'center',
    width: '70%'
  },
  label: {
    flex: 5,
    fontSize: 16,
    fontWeight: "bold",
    borderColor: 'red',
    //borderWidth: 1
  },
  switch: {
    flex: 1,
    alignSelf: "right",
    borderColor: 'blue',
    borderWidth: 1
  }
});