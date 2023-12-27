import React from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, FlatList, Pressable } from 'react-native';
import AppContext from '../components/AppContext.js';
import { useContext, useState, useRef } from 'react';
import MyButton from '../components/MyButton.js';
import Destination from '../components/Structs.js';

/**
 * Data object returned by query:
 * @name    destination
 * @member  {uuid}  id
 * @member  {string}    postcode
 * @member  {string}    company
 * @member  {string}    site
 * @member  {string}    unit
 * @member  {string}    notes
 * @member  {float} lat
 * @member  {float} lon
 * @member  {float} dist   distance from search location if provided
 * 
 */

function formatDist(m, units) {
    let res;
    let x;
    let sym;
    if (units == 'mi') {
        x = m / 1609.344;
        sym = 'mi';
    } else {
        x = m / 1000;
        sym = 'km';
    }
    if (x > 20.0) {
        x = x.toFixed(0);
    } else {
        x = x.toFixed(1);
    }
    res = `${x} ${sym}`;
    return res;
}

export default function ResultsScreen(props) {
    const myContext = useContext(AppContext);
    const navigation = props.navigation;
    const data = myContext.SearchResults; // Destination[]

    console.log(`results screen: ${JSON.stringify(data)}`);
    const myItemSeparator = () => {
        return <View style={{ height: 1, backgroundColor: "grey", marginHorizontal: 10 }} />;
    };

    function addDest() {
        const sel = myContext.SelectedDest;
        sel.Id = null;
        myContext.setSelectedDest(sel);
        navigation.navigate('AddDest');
    }

    const myListEmpty = () => {
        return (
            <View style={{ alignItems: "center" }}>
                <Text style={styles.result}>No destinations found.</Text>
            </View>
        );
    };

    const doSelect = (index, props) => {
        // copy selected entry to context
        console.log(`in doSelect, full data: ${JSON.stringify(data)}`);
        myContext.setSelectedDest(data[index]);
/*
        myContext.setSelectedId(data[index].Id);
        myContext.setSelectedSite(data[index].Site);
        myContext.setSelectedLat(data[index].Latitude);
        myContext.setSelectedLon(data[index].Longitude);
        myContext.setSelectedUnit(data[index].Unit);
        myContext.setSelectedCompany(data[index].Company);
        myContext.setSelectedPostcode(data[index].Postcode);
        myContext.setSelectedNotes(data[index].Notes);
*/
        //setSelId(index);
        navigation.navigate('DestDetails');
    }

    const myRenderItem = ({ item, index }) => {
        return (
            <Pressable
                onPress={() => doSelect(index, props)}>
                <View style={styles.result}>
                    <Text style={styles.company}>{item.Company}</Text>
                    <Text style={styles.postcode}>{item.Postcode}</Text>
                    <Text style={styles.site}>Site: {item.Site}</Text>
                    <Text style={styles.unit}>Unit: {item.Unit}</Text>
                    {item.Dist && <Text style={styles.dist}>{formatDist(item.Dist, myContext.Profile.distance_units)}</Text>}
                </View>
            </Pressable>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
                data={data}
                renderItem={myRenderItem}
                keyExtractor={(item) => item.Id}
                ListEmptyComponent={myListEmpty}
                ListHeaderComponent={() => (
                    <Text style={{ fontSize: 30, textAlign: "center", marginTop: 20, fontWeight: 'bold', textDecorationLine: 'underline' }}>
                        List of Destinations
                    </Text>
                )}
                ListFooterComponent={() => {
                    <Text style={{ fontSize: 30, textAlign: "center", marginBottom: 20, fontWeight: 'bold' }}>Thank You</Text>
                }}
                ItemSeparatorComponent={myItemSeparator}
            />
            <Text>{myContext.Profile.company}</Text>
            <MyButton caption="Select" onPress={() => navigation.navigate('DestDetails')} />
            <MyButton caption="Add destination" onPress={addDest} />
            <MyButton caption="Search again" onPress={() => navigation.navigate('Search')} />
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
    list: {
        flex: 1,
        width: 300
    },
    result: {
        borderWidth: 1
    },
    postcode: {

    },
    company: {

    },
    unit: {

    },
    site: {

    },
    dist: {
        fontStyle: 'italic'
    }
});