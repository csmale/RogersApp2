import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext } from 'react';
import MyButton from '../components/MyButton.js';
import { Linking } from 'react-native';


export default function NavigateScreen(props) {
    const myContext = useContext(AppContext);
    function LaunchGoogleNavigation() {
        let url = `https://www.google.com/maps/dir/?api=1&destination=${myContext.SelectedLat},${myContext.SelectedLon}`;

        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    }
    return (
        <View style={styles.container}>
            <Text>Start Navigation</Text>
            <Text>{myContext.Profile.company}</Text>
            <MyButton caption="Google Maps" onPress={LaunchGoogleNavigation} {...props} />
            <MyButton caption="Home" onPress={() => props.navigation.navigate('Main')} {...props} />
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
});