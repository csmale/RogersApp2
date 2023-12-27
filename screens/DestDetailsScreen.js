import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import MyButton from '../components/MyButton.js';
import MapView, { UrlTile, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import {Destination} from '../components/Structs.js';

export default function DestDetailsScreen(props) {
  /**
   * @property {object} Profile setProfile
   * @property {boolean} IsLoggedIn setIsLoggedIn
   * @property {string} DeviceId setDeviceId
   * @property {boolean} UseBiometrics setUseBiometrics,
   * LocationPermissionChecked, setLocationPermissionChecked,
    LocationPermissionGranted, setLocationPermissionGranted,
    Session, setSession,
    SearchLat, setSearchLat,
    SearchLon, setSearchLon,
    SearchPostcode, setSearchPostcode,
    SearchCompany, setSearchCompany,
    SearchSite, setSearchSite,
    SearchUnit, setSearchUnit,
    SearchRadius, setSearchRadius,
    SearchResults, setSearchResults,
    SelectedDest, setSelectedDest,
   */
  const myContext = useContext(AppContext);
  const navigation = props.navigation;
  const thisDest = myContext.SelectedDest;
  console.log(`dest details: ${JSON.stringify(thisDest)}`);

  const mapType = "google";

  /*
  function onRegionChangeComplete(region) {
    // console.log(`region change: ${JSON.stringify(region)}`);
    setLocLatitude(region.latitude);
    setLocLongitude(region.longitude);
  }
  function onDragEnd(coordinates) {
    // console.log(`region change: ${JSON.stringify(region)}`);
    setLocLatitude(coordinates.latitude);
    setLocLongitude(coordinates.longitude);
  }
  */

  function editDest() {
    navigation.navigate('AddDest');
  }

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.mapcontainer}>
        <Text style={styles.text}>{thisDest.Company}, {thisDest.Site}, {thisDest.Postcode}, {thisDest.Unit}</Text>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{ latitude: thisDest.Latitude, longitude: thisDest.Longitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
          mapType='hybrid'
        >
          {mapType == "osm" ?
            <UrlTile
              /**
               * The url template of the tile server. The patterns {x} {y} {z} will be replaced at runtime
               * For example, https://tile.openstreetmap.org/{z}/{x}/{y}.png
               */
              urlTemplate={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'}
              /**
               * The maximum zoom level for this tile overlay. Corresponds to the maximumZ setting in
               * MKTileOverlay. iOS only.
               */
              maximumZ={19}
              /**
               * flipY allows tiles with inverted y coordinates (origin at bottom left of map)
               * to be used. Its default value is false.
               */
              flipY={false}
            />
            : <></>}
          <Marker
            description='destination'
            coordinate={{ latitude: thisDest.Latitude, longitude: thisDest.Longitude }}
          ></Marker>
        </MapView>
        <Text style={styles.text}>Location: {thisDest.Latitude}, {thisDest.Longitude}</Text>
        <Text style={styles.text}>Notes: {thisDest.Notes}</Text>
      </View>
      <View style={styles.buttonArea}>
        <MyButton caption="Confirm" onPress={() => props.navigation.navigate('Navigate')} />
        <MyButton caption="Edit Destination" onPress={editDest} />
        <MyButton caption="Return to results" onPress={() => props.navigation.navigate('Results')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  mapcontainer: {
    flex: 4,
    width: '100%'
  },
  map: {
    flex: 1
  },
  buttonArea: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14
  }

});