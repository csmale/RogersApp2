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

  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [searchLat, setSearchLat] = useState(myContext.SearchLat);
  const [searchLon, setSearchLon] = useState(myContext.SearchLon);

  useEffect(() => {
    (async () => {

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      // setSearchLat(location.coords.latitude);
      // setSearchLon(location.coords.longitude);
      setSearchLat(location.coords.latitude);
      setSearchLon(location.coords.longitude);
    })();
  },[]);

  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  /*
    if (myContext.SearchLat == 0.0) {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
        rationale: {
          title: 'Location permission',
          message: 'The app needs the permission to request your location.',
          buttonPositive: 'Ok',
        },
      })
        .then(location => {
          console.log(location);
          myContext.setSearchLat(location.latitude);
          myContext.setSearchLon(location.longitude);
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
          myContext.setSearchLat(0.0);
          myContext.setSearchLon(0.0);
        })
    }
  */
    function goSearch() {
      myContext.setSearchLat(searchLat);
      myContext.setSearchLon(searchLon);
      navigation.navigate('Search');
    }

  const navigation = props.navigation;
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
          <Marker coordinate={{latitude: searchLat, longitude: searchLon}} ></Marker>
        </MapView>
      </View>
      <View style={styles.bottomhalf}>
        <Text>Welcome {myContext.Profile.displayname}</Text>
        <Text>Logged in as {myContext.Profile.userid}</Text>
        <Text>{myContext.Profile.company}</Text>
        <Text>Lat: {searchLat} Lon: {searchLon}</Text>
        <MyButton caption='Destination' onPress={goSearch} {...props} />
        <MyButton caption='Vehicle' onPress={() => navigation.navigate('VehicleList')} {...props} />
        <MyButton caption='Settings' onPress={() => navigation.navigate('Settings')} {...props} />
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
    width: 400,
    flex: 1,
    alignItems: 'center',
  },
  bottomhalf: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});