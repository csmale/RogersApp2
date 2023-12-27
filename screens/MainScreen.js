import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext, useState, useEffect } from 'react';
import MyButton from '../components/MyButton.js';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

// remove PROVIDER_GOOGLE import if not using Google Maps

// import GetLocation from 'react-native-get-location';


/*
Map
Zoom in
Zoom out
Centre on current location
Destination: Link to choose destination
Vehicle: Link to select vehicle profile
Settings: Link to edit user profile
*/
export default function MainScreen(props) {
  const myContext = useContext(AppContext);
  const navigation = props.navigation;

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchLat, setSearchLat] = useState(myContext.SearchLat);
  const [searchLon, setSearchLon] = useState(myContext.SearchLon);

  /**
   * Runs on each render to update current position
   */
  useEffect(() => {
      (async () => {
      if (myContext.LocationPermissionChecked) {
        if(!myContext.setLocationPermissionGranted) {
          return;
        }
      } else {
        let { status } = await Location.requestForegroundPermissionsAsync();
        myContext.setLocationPermissionChecked(true);
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        myContext.setLocationPermissionGranted(true);
      }

      let thisloc = await Location.getCurrentPositionAsync({});
      setLocation(thisloc);
      setSearchLat(thisloc.coords.latitude);
      setSearchLon(thisloc.coords.longitude);
    })();
  });

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  function goSearch() {
    myContext.setSearchLat(searchLat);
    myContext.setSearchLon(searchLon);
    navigation.navigate('Search');
  }

  return (
    <View style={styles.container}>

      <View style={styles.mapbox}>
        <MapView
          provider={PROVIDER_GOOGLE} // remove if not using Google Maps
          style={styles.map}
          region={{
            latitude: searchLat,
            longitude: searchLon,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker coordinate={{ latitude: searchLat, longitude: searchLon }} ></Marker>
        </MapView>
      </View>
      <View style={styles.bottomhalf}>
        <Text>Welcome {myContext.Profile.displayname}</Text>
        <Text>Logged in as {myContext.Profile.userid}</Text>
        <Text>{myContext.Profile.company}</Text>
        <Text>Lat: {searchLat} Lon: {searchLon}</Text>
        <MyButton caption='Destination' onPress={goSearch} />
        <MyButton caption='Vehicle' onPress={() => navigation.navigate('VehicleList')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapbox: {
    height: 400,
    width: '100%',
    flex: 1,
    alignItems: 'center',
  },
  bottomhalf: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});