import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext } from 'react';
import MyButton from '../components/MyButton.js';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

export default function DestDetailsScreen(props) {
  const myContext = useContext(AppContext);

  return (
    <View style={styles.container}>
      <StatusBar></StatusBar>
      <View style={styles.mapcontainer}>
        <Text>Destination Details {myContext.Profile.displayname}</Text>
        <Text>{myContext.SelectedCompany}, {myContext.SelectedSite}, {myContext.SelectedPostcode}, {myContext.SelectedUnit}</Text>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          region={{ latitude: myContext.SelectedLat, longitude: myContext.SelectedLon, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
          mapType='hybrid'
        >
          <Marker
            description='destination'
            coordinate={{ latitude: myContext.SelectedLat, longitude: myContext.SelectedLon }}
          ></Marker>
        </MapView>

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
  }

});