import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext, useState } from 'react';
import MyButton from '../components/MyButton.js';
import MyInput from '../components/MyInput.js';
import MyDropdown from '../components/MyDropdown.js';
import { updateProfile } from '../components/Backend';

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export default function SettingsScreen(props) {
  const myContext = useContext(AppContext);
  const profile = myContext.Profile;
  const [email, setEmail] = useState(profile.email);
  const [displayname, setDisplayname] = useState(profile.displayname);
  const [dunits, setDunits] = useState(profile.distance_units);
  const [company, setCompany] = useState(profile.company);
  const [errTxt, setErrTxt] = useState('');
  const dunitdata = [
    { label: "Miles", value: "mi" },
    { label: "Kilometres", value: "km" }
  ];

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
      props.navigation.navigate('Main');
    }
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
      <MyButton caption="Save" onPress={() => doSaveSettings()} {...props} />
      <MyButton caption="Cancel" onPress={() => props.navigation.navigate('Main')} {...props} />
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
    justifyContent: 'left',
  },
  errText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "red"
  },
});