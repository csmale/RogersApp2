import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import MyButton from '../components/MyButton.js';
import MapView, { UrlTile, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function DestDetailsScreen(props) {
  const myContext = useContext(AppContext);
  const [locLatitude, setLocLatitude] = useState(myContext.SelectedLat);
  const [locLongitude, setLocLongitude] = useState(myContext.SelectedLon);

  const mapType = "google";

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

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.mapcontainer}>
        <Text style={styles.text}>Destination Details {myContext.Profile.displayname}</Text>
        <Text style={styles.text}>{myContext.SelectedCompany}, {myContext.SelectedSite}, {myContext.SelectedPostcode}, {myContext.SelectedUnit}</Text>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{ latitude: locLatitude, longitude: locLongitude, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
          onRegionChange={(region)=>{onRegionChangeComplete(region)}}
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
            draggable
            onDragEnd={({coordinates}) => {onDragEnd(coordinates)}}
            coordinate={{ latitude: locLatitude, longitude: locLongitude }}
          ></Marker>
        </MapView>
        <Text style={styles.text}>Location: {locLatitude},{locLongitude}</Text>
        <Text style={styles.text}>Notes: {myContext.SelectedNotes}</Text>
      </View>
      <View style={styles.buttonArea}>
        <MyButton caption="Confirm" onPress={() => props.navigation.navigate('Navigate')} {...props} />
        <MyButton caption="Return to results" onPress={() => props.navigation.navigate('Results')} {...props} />
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
    flex: 6,
    marginTop: 32,
    width: '100%'
  },
  map: {
    flex: 1
  },
  buttonArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14
  }

});