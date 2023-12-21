import { StatusBar } from 'expo-status-bar';
import React, { useCallback } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useState, useContext, useEffect, useRef } from 'react';
import MyButton from '../components/MyButton.js';
import MyInput from '../components/MyInput.js';
import MyDropdown from '../components/MyDropdown.js';
import { searchDests } from '../components/Backend.js';

export default function SearchScreen(props) {
  const myContext = useContext(AppContext);
  const [isFocus, setIsFocus] = useState(false);
  const canSearch = useRef(false);

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
  useEffect(() => {
    if (!myContext.SearchRadius) {
      myContext.setSearchRadius(searchdists[2].value);
    }
  }, []);

  canSearch.current = (myContext.SearchCompany.length > 0)
    || (myContext.SearchPostcode.length > 0)
    || (myContext.SearchSite.length > 0)
    || (myContext.SearchUnit.length > 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.searchcontainer}>
        <Text style={styles.textbox}>To search for arrival directions, please enter the information as it was given to you.</Text>

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
        <MyButton caption="Search" disabled={!canSearch.current} onPress={() => doSearch()} />
        <MyButton caption="Add destination" onPress={() => props.navigation.navigate('AddDest')} />
        <MyButton caption="Back" onPress={() => props.navigation.navigate('Main')} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    width: '100%',
  },
  searchcontainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
  },
  textbox: {
    fontSize: 16,
    width: '70%',
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 8,
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