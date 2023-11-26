import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useState, useContext } from 'react';
import MyButton from '../components/MyButton.js';
import MyInput from '../components/MyInput.js';
import MyDropdown from '../components/MyDropdown.js';
import { searchDests } from '../components/Backend.js';

export default function SearchScreen(props) {
  const myContext = useContext(AppContext);
  const [isFocus, setIsFocus] = useState(false);

  async function doSearch() {
    const opts = {
      site: myContext.SearchSite,
      postcode: myContext.SearchPostcode,
      company: myContext.SearchCompany,
      unit: myContext.SearchUnit,
      dist: myContext.SearchRadius
    };
    res = await searchDests(opts);
    console.log(`returned ${JSON.stringify(res)}`);
    myContext.setSearchResults(res);
    props.navigation.navigate('Results')
  }

  const datakm = [
    { label: '100 m', value: 100 },
    { label: '1 km', value: 1000 },
    { label: '5 km', value: 5000 },
    { label: '10 km', value: 10000 },
  ];
  const datami = [
    { label: '100 yds', value: 90 },
    { label: '1 mi', value: 1609 },
    { label: '5 mi', value: 8045 },
    { label: '10 mi', value: 16090 },
  ];
  const searchdists = (myContext.Profile.distance_units == "mi") ? datami : datakm;
  useCallback(() => {
    if (!myContext.SearchRadius) {
      myContext.setSearchRadius(searchdists[2].value);
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text>Destination search screen for {myContext.Profile.displayname}</Text>
      <Text>{myContext.Profile.company}</Text>

      <MyInput label='Postcode:' placeholder='AA1 9ZZ' value={myContext.SearchPostcode} onChangeText={myContext.setSearchPostcode}></MyInput>
      {myContext.SearchPostcode != '' && <View style={styles.searchcontainer}>
        <MyDropdown
          label="Search Radius:"
          data={searchdists}
          labelField="label"
          valueField="value"
          placeholder='Select...'
          value={myContext.SearchRadius}
          onChange={myContext.setSearchRadius} >
        </MyDropdown>
      </View>
      }
      <MyInput label='Company:' placeholder='' value={myContext.SearchCompany} onChangeText={myContext.setSearchCompany}></MyInput>
      <MyInput label='Site:' placeholder='' value={myContext.SearchSite} onChangeText={myContext.setSearchSite}></MyInput>
      <MyInput label='Unit:' placeholder='' value={myContext.SearchUnit} onChangeText={myContext.setSearchUnit}></MyInput>
      <MyButton caption="Search" onPress={() => doSearch()} {...props} />
      <MyButton caption="Back" onPress={() => props.navigation.navigate('Main')} {...props} />
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
  dropdown: {
    height: 30,
    width: 210,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ddlabel: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});