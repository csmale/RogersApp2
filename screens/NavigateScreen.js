import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext, useState, useEffect } from 'react';
import MyButton from '../components/MyButton.js';
import { Linking } from 'react-native';
import { getW3w } from '../components/Backend.js';
const OpenLocationCode = require('../components/openlocationcode.min.js');

export default function NavigateScreen(props) {
    const navigation = props.navigation;
    const myContext = useContext(AppContext);
    const thisDest = myContext.SelectedDest;
    function LaunchGoogleNavigation() {
        let url = `https://www.google.com/maps/dir/?api=1&destination=${thisDest.Latitude},${thisDest.Longitude}`;

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    }

    const olc = OpenLocationCode.encode(thisDest.Latitude, thisDest.Longitude, OpenLocationCode.CODE_PRECISION_EXTRA);
    const [w3w, setW3w] = useState('unknown');
    useEffect(() => {
        (async () => {
            let x = await getW3w(thisDest.Latitude, thisDest.Longitude);
            if (x.error) {
                setW3w(x.error);
            } else {
                setW3w(x.w3w);
            }
        })();
    }, [])

    return (
        <View style={styles.container}>
            <Text>Start Navigation</Text>
            <Text style={styles.text}>Location: {thisDest.Latitude}, {thisDest.Longitude}</Text>
            <Text style={styles.text}>Open Location Code: {olc}</Text>
            <Text style={styles.text}>What3words: {w3w}</Text>
            <Text style={styles.text}>Notes: {thisDest.Notes}</Text>
            <Text style={styles.text}>Show on Google Maps: (geo: uri)</Text>
            <Text style={styles.text}>Share: (share without dialog)</Text>
            <Text style={styles.text}>Share with: (share with dialog)</Text>
            <MyButton caption="Route with Google Maps" onPress={LaunchGoogleNavigation} />
            <MyButton caption="Back" onPress={() => navigation.goBack()} />
            <MyButton caption="Home" onPress={() => navigation.navigate('Main')} />
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
    text: {
        fontSize: 14,
    },
});