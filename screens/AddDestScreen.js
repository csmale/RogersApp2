import { StatusBar, setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext, useState, useRef, useEffect } from 'react';
import MyButton from '../components/MyButton.js';
import * as ImagePicker from 'expo-image-picker';
import MyInput from '../components/MyInput.js';
import { addDest, updateDest } from '../components/Backend.js';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import { Destination } from '../components/Structs.js';

export default function AddDestScreen(props) {
    const myContext = useContext(AppContext);
    const navigation = props.navigation;
    const [newCompany, setNewCompany] = useState('');
    const [newPostcode, setNewPostcode] = useState('');
    const [newSite, setNewSite] = useState('');
    const [newUnit, setNewUnit] = useState('');
    const [newLat, setNewLat] = useState(myContext.SearchLat);
    const [newLon, setNewLon] = useState(myContext.SearchLon);
    const [newNotes, setNewNotes] = useState('');
    const [image, setImage] = useState(null);
    const [err, setErr] = useState('');
    const imageDetails = useRef(null);
    const newDest = myContext.SelectedDest;

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErr('Permission to access location was denied');
                return;
            }

            // if editing an existing entry, start with current values. otherwise leave as defaults from useState() above
            if (newDest.Id) {
                setNewCompany(newDest.Company);
                setNewPostcode(newDest.Postcode);
                setNewSite(newDest.Site);
                setNewUnit(newDest.Unit);
                setNewLat(newDest.Latitude);
                setNewLon(newDest.Longitude);
                setNewNotes(newDest.Notes);
                navigation.setOptions({ headerTitle: 'Edit' });
            } else {
                let thisloc = await Location.getCurrentPositionAsync({});
                newDest.Longitude = thisloc.coords.longitude;
                newDest.Latitude = thisloc.coords.latitudel
                navigation.setOptions({ headerTitle: 'Add' });
            }
        })();
    }, []);

    const imageOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
        exif: true,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.2,
        allowsMultipleSelection: false,
    }

    async function onSelectPhoto() {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync(imageOptions);
        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            imageDetails.current = result.assets[0];
            console.log(JSON.stringify(result.assets[0].exif));
        }
    }

    async function onTakePhoto() {
        let result = await ImagePicker.launchCameraAsync(imageOptions);
        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            imageDetails.current = result.assets[0];
            console.log(JSON.stringify(result.assets[0].exif));
        }
    }

    async function doAddDest() {
        if (newCompany == '' || newCompany.length < 3) {
            setErr('Please enter the company name');
            return;
        }
        if (newPostcode == '') {
            setErr('Please enter a valid postcode');
            return;
        }
        if (newSite == '') {
            setErr('Please enter the site name');
            return;
        }
        if (newUnit == '') {
            setErr('Please enter the unit name');
            return;
        }
        var pc = newPostcode.toUpperCase().replace(' ', '');
        var pcregexp = /^([A-Z]{1,2}\d[A-Z\d]?) ?(\d[A-Z]{2})$/;
        var pcregexp2 = /^([A-Z]{1,2}\d[A-Z\d]?)$/;
        var matches = pc.match(pcregexp);
        if (matches && matches.length == 3) {
            pc = `${matches[1]} ${matches[2]}`;
        } else {
            matches = pc.match(pcregexp2);
            if (matches && matches.length == 2) {
                pc = matches[1];
            } else {
                setErr(`Please enter a complete UK postcode`);
                return null;
            }
        }
        setNewPostcode(pc);
        // call backend to store new destination
        newDest.Company = newCompany;
        newDest.Postcode = newPostcode;
        newDest.Unit = newUnit;
        newDest.Site = newSite;
        newDest.Notes = newNotes;
        myContext.setSelectedDest(newDest);
/*
        const newdest = {
            company: newCompany,
            postcode: pc,
            unit: newUnit,
            site: newSite,
            notes: newNotes,
            longitude: imageDetails.exif?.GPSLongitude,
            latitude: imageDetails.exif?.GPSLatitude,
        }
        if (!newdest.longitude || !newdest.latitude) {
            if (myContext.SelectedId) {
                newdest.longitude = myContext.SelectedLon;
                newdest.latitude = myContext.SelectedLat;
            } else {
                newdest.longitude = myContext.SearchLon;
                newdest.latitude = myContext.SearchLat;
            }
        }
*/

        if (newDest.Id) {
            console.log(`updating dest: ${JSON.stringify(newDest)}`);
            var res = updateDest(newDest);
        } else {
            console.log(`adding dest: ${JSON.stringify(newDest)}`);
            var res = addDest(newDest);
        }

        if (res == null) {
            setErr('Unable to add destination');
            return;
        }
        if (res.error) {
            setErr(res.error);
            return;
        }
        navigation.navigate('Main');
    }

    const canAdd = (newCompany.length > 0)
        && (newSite.length > 0)
        && (newUnit.length > 0)
        && (newPostcode.length > 0);

    return (
        <View style={styles.container}>
            {image && <Image source={{ uri: image }} style={styles.image} />}
            <MyInput placeholder='Company' label='Company' value={newCompany} onChangeText={setNewCompany} />
            <MyInput placeholder='Site' label='Site' value={newSite} onChangeText={setNewSite} />
            <MyInput placeholder='Unit' label='Unit' value={newUnit} onChangeText={setNewUnit} />
            <MyInput placeholder='Postcode' label='Postcode' value={newPostcode} onChangeText={setNewPostcode} />
            <MyInput placeholder='Notes' label='Notes' value={newNotes} onChangeText={setNewNotes} />
            {err != '' && <Text style={styles.errText}>{err}</Text>}

            <MyButton caption="Select Photo" onPress={onSelectPhoto} />
            <MyButton caption="Take Photo" onPress={onTakePhoto} />

            <MyButton caption="Save" disabled={!canAdd} onPress={doAddDest} />
            <MyButton caption="Cancel" onPress={() => navigation.navigate('Main')} />
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
    image: {
        width: 200,
        height: 200,
    },
    errText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "red"
    },
});